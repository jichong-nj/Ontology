// 规则调度器（后台定时任务）
// 执行「可配置的自动化规则」：根据规则的 trigger 决定何时触发，
// 触发后调用规则指定的 conditionFunction 评估条件，当返回命中对象时，
// 调用规则指定的 Action 落地（写入本体可写侧 / 通知 / 审批 等）。
//
// 本调度器是「通用规则引擎」的执行侧，不假定动作一定是「告警」——
// 告警只是 createDimissionAlert 这个 Action 的产物；规则本身只关心
// “满足条件 → 调某个 Action”。这与 Palantir 的 Watchdog + Action Type + Schedule 同构。
//
// 设计要点：
// - Function 可配置：规则只引用 conditionFunction，逻辑与调度解耦，可热替换/在线编辑。
// - Action 可配置：命中后由 actionApiName 决定「生成什么对象、写到哪个类型 / 通知谁」，与告警解耦。
// - Trigger 可配置：schedule（周期轮询）/ event（对象写入事件触发）。
// - 源端只读，动作结果只写本体可写侧（object_write），不回写数据源。
import type { MetadataRepository, FunctionSandbox, AutomationRule, ActionPrecondition } from './types';
import { evaluateRuleCondition } from './rule-condition';
import { cronMatches, cronMinuteKey } from './cron';
import { randomUUID } from 'node:crypto';
import type { AutomationEffect, AutomationEffectResult } from './types';
import { runWithAutomationContext, type AutomationContext } from './automation-context';

export interface RuleSchedulerOptions {
  // 轮询间隔（毫秒）；schedule 触发器各自的 intervalSeconds 决定各自执行频率
  tickMs?: number;
  // 条件函数的执行包装（用于只读隔离等；默认直接 sandbox.execute）
  executeCondition?: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

// 一次规则执行的结果（供可观测/测试断言）
export interface RuleEvaluationResult {
  rule: string;
  trigger: string;
  ran: boolean;
  error?: string;
  flaggedCount: number;
  actionsInvoked: number;
  skippedByPrecondition: number; // 因 Action 前置校验不通过而跳过的命中对象数
}

// 一个被调度器识别的「条件命中项」的标准形状（Function 返回里提取）
interface FlaggedItem {
  rid: string;
  [k: string]: unknown;
}

function extractFlagged(output: unknown): FlaggedItem[] {
  if (!output || typeof output !== 'object') return [];
  const o = output as Record<string, unknown>;
  // 兼容 { flagged: [...] } 或 { flaggedEmployees: [...] } 等数组字段
  for (const key of ['flagged', 'flaggedEmployees', 'matches', 'items']) {
    if (Array.isArray(o[key])) return o[key] as FlaggedItem[];
  }
  return [];
}

// 校验单个命中对象是否满足 Action 的前置校验规则（对标 Palantir Action 自带 rules）。
// 不满足时返回对应 message；全部满足返回 null。
function checkPreconditions(item: FlaggedItem, preconditions?: ActionPrecondition[]): string | null {
  if (!preconditions || preconditions.length === 0) return null;
  for (const pc of preconditions) {
    const v = item[pc.property];
    switch (pc.kind) {
      case 'requiredProperty':
        if (v === undefined || v === null || v === '') return pc.message;
        break;
      case 'notEmpty':
        if (Array.isArray(v) ? v.length === 0 : !v) return pc.message;
        break;
      case 'minValue':
        if (typeof v !== 'number' || v < (pc.value ?? 0)) return pc.message;
        break;
      case 'maxValue':
        if (typeof v !== 'number' || v > (pc.value ?? 0)) return pc.message;
        break;
    }
  }
  return null;
}

export class RuleScheduler {
  private timer: NodeJS.Timeout | null = null;
  private lastRanAt = new Map<string, number>();
  private lastCronMinute = new Map<string, string>();
  private lastObjectRun = new Map<string, number>();
  private eventTimers = new Map<string, NodeJS.Timeout>();
  private scheduledEvents = new Map<string, {
    rule: AutomationRule; objectType: string; objectRid: string;
    patch: Record<string, unknown>; chain?: AutomationContext;
  }>();
  private running = new Map<string, boolean>();
  private tickMs: number;
  private repo: MetadataRepository;
  private sandbox: FunctionSandbox;
  private executeCondition?: (name: string, args: Record<string, unknown>) => Promise<unknown>;

  constructor(repo: MetadataRepository, sandbox: FunctionSandbox, opts: RuleSchedulerOptions = {}) {
    this.repo = repo;
    this.sandbox = sandbox;
    this.tickMs = opts.tickMs ?? 10_000;
    this.executeCondition = opts.executeCondition;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => void this.tick(), this.tickMs);
    // 立即跑一次（便于演示/验证）
    void this.tick();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const t of this.eventTimers.values()) clearTimeout(t);
    this.eventTimers.clear();
    this.scheduledEvents.clear();
  }

  private async tick() {
    // 读取通用规则表；调度器只轮询 schedule 类触发器，event 类由对象写入事件驱动（见 handleObjectWrite）。
    const rules = await this.repo.listRules();
    const now = Date.now();
    const scheduled = rules.filter((r) => r.trigger.kind === 'schedule');
    await Promise.all(scheduled.map((r) => this.evaluateRule(r, now)));
    await this.flushScheduledEvents();
  }

  // scheduled 模式：事件先缓冲，下一次 tick 统一评估
  private async flushScheduledEvents(): Promise<void> {
    if (!this.scheduledEvents.size) return;
    const items = [...this.scheduledEvents.values()];
    this.scheduledEvents.clear();
    for (const item of items) {
      await this.evaluateRule(item.rule, Date.now(), {
        objectType: item.objectType, objectRid: item.objectRid, patch: item.patch, __chain: item.chain,
      }).catch((e) => console.warn(`[automation] ${item.rule.apiName} 定时事件失败: ${e?.message ?? e}`));
    }
  }

  // 单次规则评估（可被 API 手动触发，或 event 触发器调用）
  async evaluateRule(
    rule: AutomationRule,
    now = Date.now(),
    triggerContext?: Record<string, unknown>,
    opts?: { force?: boolean },
  ): Promise<RuleEvaluationResult> {
    const base: RuleEvaluationResult = {
      rule: rule.apiName, trigger: rule.trigger.kind, ran: false, flaggedCount: 0, actionsInvoked: 0, skippedByPrecondition: 0,
    };
    if (!rule.enabled) return base;

    // 级联上下文（事件触发时由写入事件携带）
    const incoming = (triggerContext as any)?.__chain as AutomationContext | undefined;
    const chainId = incoming?.chainId ?? randomUUID();
    const depth = incoming?.depth ?? 0;
    const path = incoming?.path ?? [];
    const depthLimit = rule.execution?.chainDepthLimit ?? 5;

    if (incoming) {
      const reason = depth > depthLimit
        ? `chain_depth: ${depth} > ${depthLimit}`
        : path.includes(rule.apiName)
          ? `chain_cycle: ${[...path, rule.apiName].join(' > ')}`
          : '';
      if (reason) {
        // 级联被拦截也要留审计记录
        await this.repo.createAutomationRun({
          id: randomUUID(), automationApiName: rule.apiName, triggerKind: rule.trigger.kind,
          triggerContext: triggerContext ?? {}, status: 'skipped', matchedCount: 0, effectResults: [],
          error: reason, chainId, depth, startedAt: new Date(now).toISOString(),
          finishedAt: new Date(now).toISOString(), durationMs: 0,
        }).catch(() => {});
        console.warn(`[automation] ${rule.apiName} 级联拦截: ${reason}`);
        return base;
      }
    }

    // 冷却：同一 automation + 对象在窗口内只执行一次
    const objectRid = (triggerContext as any)?.objectRid as string | undefined;
    if (objectRid && rule.execution?.cooldownSeconds) {
      const key = `${rule.apiName}:${objectRid}`;
      const last = this.lastObjectRun.get(key) ?? 0;
      if (now - last < rule.execution.cooldownSeconds * 1000) return base;
      this.lastObjectRun.set(key, now);
    }

    // schedule 节流：cron 按分钟匹配；interval 按秒节流。manual（force）跳过节流。
    if (!opts?.force && rule.trigger.kind === 'schedule') {
      const trig = rule.trigger as { kind: 'schedule'; intervalSeconds?: number; cron?: string };
      if (trig.cron) {
        const d = new Date(now);
        if (!cronMatches(trig.cron, d)) return base;
        const key = `${rule.apiName}:${cronMinuteKey(d)}`;
        if (this.lastCronMinute.get(rule.apiName) === key) return base;
        this.lastCronMinute.set(rule.apiName, key);
      } else {
        const last = this.lastRanAt.get(rule.apiName) ?? 0;
        if (now - last < (trig.intervalSeconds ?? 60) * 1000) return base;
      }
    }
    if (this.running.get(rule.apiName)) return base;
    this.running.set(rule.apiName, true);
    this.lastRanAt.set(rule.apiName, now);

    const runId = randomUUID();
    const startedAt = new Date().toISOString();
    let runCreated = false;

    try {
      // 1) 条件评估：声明式条件或 conditionFunction
      const runFn = (name: string, args: Record<string, unknown>) => this.executeCondition
        ? this.executeCondition(name, args)
        : this.sandbox.execute(name, args);

      let flagged: FlaggedItem[];
      let matched: boolean;
      if (rule.condition) {
        const result = await evaluateRuleCondition(this.repo, rule.condition, runFn, rule.params);
        flagged = result.items as FlaggedItem[];
        matched = result.matched;
      } else {
        const output = await runFn(rule.conditionFunction!, rule.params ?? {});
        flagged = extractFlagged(output);
        matched = flagged.length > 0;
      }
      // 事件规则默认只评估「当前写入对象」；scope=type 时保留整类评估
      if (rule.trigger.kind === 'event') {
        const trig = rule.trigger as { scope?: 'object' | 'type' };
        const rid = (triggerContext as any)?.objectRid;
        if ((trig.scope ?? 'object') === 'object' && rid) {
          const scoped = flagged.filter((f: any) => String(f.rid ?? f.objectRid ?? '') === String(rid));
          flagged = scoped;
          matched = scoped.length > 0;
        }
      }

      base.ran = true;
      base.flaggedCount = flagged.length;

      await this.repo.createAutomationRun({
        id: runId,
        automationApiName: rule.apiName,
        triggerKind: rule.trigger.kind,
        triggerContext: triggerContext ?? {},
        status: 'running',
        matchedCount: flagged.length,
        effectResults: [],
        chainId,
        depth,
        startedAt,
      });
      runCreated = true;

      if (!matched) {
        await this.repo.finishAutomationRun(runId, {
          status: 'skipped', matchedCount: 0, effectResults: [],
          finishedAt: new Date().toISOString(), durationMs: Date.now() - now,
        });
        return base;
      }

      // 2) 效果：effects 数组优先；旧规则回退 actionApiName
      const effects: AutomationEffect[] = (rule.effects?.length
        ? rule.effects
        : (rule.actionApiName ? [{ kind: 'action', actionApiName: rule.actionApiName }] : [])) as AutomationEffect[];
      if (!effects.length) {
        await this.repo.finishAutomationRun(runId, { status: 'failed', error: '未配置任何 effect', finishedAt: new Date().toISOString() });
        base.error = '未配置任何 effect';
        return base;
      }

      const effectResults: AutomationEffectResult[] = [];
      if (rule.execution?.mode === 'parallel') {
        effectResults.push(...await Promise.all(effects.map((e) => this.executeEffect(rule, e, flagged, runId, base, { chainId, depth, path }))));
      } else {
        for (const effect of effects) {
          effectResults.push(await this.executeEffect(rule, effect, flagged, runId, base, { chainId, depth, path }));
        }
      }

      const okCount = effectResults.filter((r) => r.ok).length;
      const status = okCount === effectResults.length ? 'succeeded' : okCount > 0 ? 'partial' : 'failed';
      base.actionsInvoked = okCount;
      const firstError = effectResults.find((r) => !r.ok)?.error;
      await this.repo.finishAutomationRun(runId, {
        status,
        matchedCount: flagged.length,
        effectResults,
        error: firstError,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - now,
      });
      return base;
    } catch (e: any) {
      base.error = e?.message ?? String(e);
      console.warn(`[automation] ${rule.apiName} 执行失败: ${base.error}`);
      if (runCreated) {
        await this.repo.finishAutomationRun(runId, {
          status: 'failed', error: base.error, finishedAt: new Date().toISOString(), durationMs: Date.now() - now,
        }).catch(() => {});
      }
      return base;
    } finally {
      this.running.set(rule.apiName, false);
    }
  }

  // 执行单个 effect（含重试与 fallback）
  private async executeEffect(
    rule: AutomationRule,
    effect: AutomationEffect,
    flagged: FlaggedItem[],
    runId: string,
    base: RuleEvaluationResult,
    chain: AutomationContext,
  ): Promise<AutomationEffectResult> {
    const started = Date.now();
    const maxAttempts = Math.max(1, effect.retry?.maxAttempts ?? rule.execution?.maxRetries ?? 1);
    let lastError: string | undefined;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts += 1;
      try {
        const result = await runWithAutomationContext(
          { chainId: chain.chainId, depth: chain.depth + 1, path: [...chain.path, rule.apiName] },
          () => this.performEffect(rule, effect, flagged, runId, base),
        );
        return {
          kind: effect.kind, ref: this.effectRef(effect), ok: true, attempts,
          durationMs: Date.now() - started, result,
        };
      } catch (e: any) {
        lastError = e?.message ?? String(e);
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, effect.retry?.backoffMs ?? 500 * attempts));
        }
      }
    }

    // fallback
    if (effect.fallback) {
      try {
        const result = await runWithAutomationContext(
          { chainId: chain.chainId, depth: chain.depth + 1, path: [...chain.path, rule.apiName] },
          () => this.performEffect(rule, effect.fallback!, flagged, runId, base),
        );
        return {
          kind: effect.kind, ref: this.effectRef(effect), ok: true, attempts,
          durationMs: Date.now() - started, result: { fallback: this.effectRef(effect.fallback), result },
        };
      } catch (e: any) {
        lastError = `${lastError}; fallback: ${e?.message ?? e}`;
      }
    }

    return {
      kind: effect.kind, ref: this.effectRef(effect), ok: false, attempts,
      durationMs: Date.now() - started, error: lastError,
    };
  }

  private effectRef(effect: AutomationEffect): string | undefined {
    if (effect.kind === 'action') return effect.actionApiName;
    if (effect.kind === 'function') return effect.function;
    if (effect.kind === 'webhook') return effect.url;
    return effect.kind === 'notify' ? `notify:${effect.channel}` : undefined;
  }

  private async performEffect(
    rule: AutomationRule,
    effect: AutomationEffect,
    flagged: FlaggedItem[],
    runId: string,
    base: RuleEvaluationResult,
  ): Promise<unknown> {
    const timeoutMs = rule.execution?.timeoutMs ?? 15000;

    if (effect.kind === 'action') {
      const action = await this.repo.getAction(effect.actionApiName);
      if (!action) throw new Error(`Action 未注册: ${effect.actionApiName}`);
      const passed: FlaggedItem[] = [];
      for (const item of flagged) {
        const reason = checkPreconditions(item, action.preconditions);
        if (reason) base.skippedByPrecondition += 1;
        else passed.push(item);
      }
      if (passed.length === 0 && flagged.length > 0) return { skipped: base.skippedByPrecondition };
      const ref = action.effect?.kind === 'function' ? (action.effect.ref ?? effect.actionApiName) : effect.actionApiName;
      return this.sandbox.execute(ref, {
        rule: rule.apiName,
        targetObjectType: rule.targetObjectType,
        alertObjectType: rule.targetObjectType,
        flagged: passed,
        params: effect.params,
        runId,
      });
    }

    if (effect.kind === 'function') {
      return this.sandbox.execute(effect.function, {
        rule: rule.apiName, flagged, params: effect.params, runId,
      });
    }

    if (effect.kind === 'webhook') {
      const res = await fetch(effect.url, {
        method: effect.method ?? 'POST',
        headers: { 'Content-Type': 'application/json', ...(effect.headers ?? {}) },
        body: JSON.stringify(effect.body ?? {
          automation: rule.apiName, runId, matchedCount: flagged.length, items: flagged.slice(0, 200),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`webhook ${res.status} ${res.statusText}`);
      return { status: res.status };
    }

    if (effect.kind === 'notify') {
      if (effect.channel === 'inapp') {
        await this.repo.createNotification({
          title: effect.title ?? `${rule.displayName} 通知`,
          body: effect.body ?? `命中 ${flagged.length} 个对象`,
          level: effect.level ?? 'info',
          recipient: effect.recipient,
          source: rule.apiName,
          runId,
        });
        return { notified: 'inapp' };
      }
      if (!effect.webhookUrl) throw new Error('notify(webhook) 缺少 webhookUrl');
      const res = await fetch(effect.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automation: rule.apiName, runId, title: effect.title, body: effect.body,
          level: effect.level, recipient: effect.recipient, matchedCount: flagged.length,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`notify webhook ${res.status}`);
      return { notified: 'webhook' };
    }

    throw new Error(`不支持的 effect 类型: ${(effect as any).kind}`);
  }

  // event 触发器入口：按每条 Automation 自己的 debounceMs / batchMode 排队。
  async dispatchObjectWrite(
    objectType: string,
    objectRid: string,
    patch: Record<string, unknown>,
    chain?: AutomationContext,
    meta?: { changeType?: 'created' | 'updated' | 'deleted'; beforePatch?: Record<string, unknown> | null; afterPatch?: Record<string, unknown> },
  ): Promise<void> {
    const rules = await this.repo.listRules();
    const matched = rules.filter(
      (r) =>
        r.enabled &&
        r.trigger.kind === 'event' &&
        r.trigger.on === 'object_write' &&
        r.trigger.objectType === objectType,
    );
    const changeType = meta?.changeType ?? 'updated';
    for (const rule of matched) {
      const trig = rule.trigger as {
        kind: 'event'; debounceMs?: number; batchMode?: 'per_rid' | 'per_type';
        changeTypes?: Array<'created' | 'updated' | 'deleted'>; changeFields?: string[];
        scope?: 'object' | 'type'; evaluationMode?: 'live' | 'scheduled';
      };
      const allowedTypes = trig.changeTypes ?? ['created', 'updated'];
      if (!allowedTypes.includes(changeType)) continue;
      if (changeType === 'updated' && trig.changeFields?.length) {
        const before = meta?.beforePatch ?? {};
        const after = meta?.afterPatch ?? {};
        const changed = trig.changeFields.some((f) => JSON.stringify((before as any)[f]) !== JSON.stringify((after as any)[f]));
        if (!changed) continue;
      }
      const mode = trig.batchMode ?? 'per_rid';
      const key = `${rule.apiName}:${mode === 'per_rid' ? objectRid : objectType}`;
      if ((trig.evaluationMode ?? 'live') === 'scheduled') {
        this.scheduledEvents.set(key, { rule, objectType, objectRid, patch, chain });
        continue;
      }
      const debounceMs = Math.max(0, Number(trig.debounceMs ?? 1000));
      const prev = this.eventTimers.get(key);
      if (prev) clearTimeout(prev);
      const timer = setTimeout(() => {
        this.eventTimers.delete(key);
        void this.evaluateRule(rule, Date.now(), { objectType, objectRid, patch, __chain: chain })
          .catch((e) => console.warn(`[automation] ${rule.apiName} 事件执行失败: ${e?.message ?? e}`));
      }, debounceMs);
      this.eventTimers.set(key, timer);
    }
  }

  // 兼容旧入口：立即排队并返回空结果（等待由 debounceMs 决定）。
  async handleObjectWrite(
    objectType: string,
    objectRid: string,
    patch: Record<string, unknown>,
    chain?: AutomationContext,
  ): Promise<RuleEvaluationResult[]> {
    await this.dispatchObjectWrite(objectType, objectRid, patch, chain);
    return [];
  }

  // 手动触发所有规则（API 调用）
  async runAll(): Promise<RuleEvaluationResult[]> {
    const rules = await this.repo.listRules();
    const now = Date.now();
    return Promise.all(rules.map((r) => this.evaluateRule(r, now, {}, { force: true })));
  }
}
