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
import type { MetadataRepository, FunctionSandbox, AutomationRule } from './types';

export interface RuleSchedulerOptions {
  // 轮询间隔（毫秒）；schedule 触发器各自的 intervalSeconds 决定各自执行频率
  tickMs?: number;
}

// 一次规则执行的结果（供可观测/测试断言）
export interface RuleEvaluationResult {
  rule: string;
  trigger: string;
  ran: boolean;
  error?: string;
  flaggedCount: number;
  actionsInvoked: number;
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

export class RuleScheduler {
  private timer: NodeJS.Timeout | null = null;
  private lastRanAt = new Map<string, number>();
  private running = new Map<string, boolean>();
  private tickMs: number;
  private repo: MetadataRepository;
  private sandbox: FunctionSandbox;

  constructor(repo: MetadataRepository, sandbox: FunctionSandbox, opts: RuleSchedulerOptions = {}) {
    this.repo = repo;
    this.sandbox = sandbox;
    this.tickMs = opts.tickMs ?? 10_000;
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
  }

  private async tick() {
    // 读取通用规则表；调度器只轮询 schedule 类触发器，event 类由对象写入事件驱动（见 handleObjectWrite）。
    const rules = await this.repo.listRules();
    const now = Date.now();
    const scheduled = rules.filter((r) => r.trigger.kind === 'schedule');
    await Promise.all(scheduled.map((r) => this.evaluateRule(r, now)));
  }

  // 单次规则评估（可被 API 手动触发，或 event 触发器调用）
  async evaluateRule(rule: AutomationRule, now = Date.now()): Promise<RuleEvaluationResult> {
    const base: RuleEvaluationResult = {
      rule: rule.apiName, trigger: rule.trigger.kind, ran: false, flaggedCount: 0, actionsInvoked: 0,
    };
    if (!rule.enabled) return base;
    // schedule 类节流：未到周期则跳过（now 用于测试可注入）；event 类不节流。
    if (rule.trigger.kind === 'schedule') {
      const last = this.lastRanAt.get(rule.apiName) ?? 0;
      if (now - last < rule.trigger.intervalSeconds * 1000) return base;
    }
    if (this.running.get(rule.apiName)) return base;
    this.running.set(rule.apiName, true);
    this.lastRanAt.set(rule.apiName, now);

    try {
      // 1) 可配置 Function：评估条件
      const output = await this.sandbox.execute(rule.conditionFunction, rule.params ?? {});
      const flagged = extractFlagged(output);
      base.ran = true;
      base.flaggedCount = flagged.length;
      if (flagged.length === 0) return base;

      // 2) 可配置 Action：落地（动作语义由 ActionType 决定，可能是生成告警/写对象/通知/审批等）
      const action = await this.repo.getAction(rule.actionApiName);
      if (!action) {
        base.error = `规则引用的 Action 未注册: ${rule.actionApiName}`;
        return base;
      }
      const res = await this.sandbox.execute(rule.actionApiName, {
        rule: rule.apiName,
        targetObjectType: rule.targetObjectType, // 动作落点对象类型（如 Alert），仅写类动作使用
        // 兼容旧动作函数体（读取 args.alertObjectType）；新函数体应优先读 targetObjectType。
        alertObjectType: rule.targetObjectType,
        flagged,
      });
      const created = Array.isArray((res as any)?.created) ? (res as any).created.length : flagged.length;
      base.actionsInvoked = created;
      return base;
    } catch (e: any) {
      base.error = e?.message ?? String(e);
      return base;
    } finally {
      this.running.set(rule.apiName, false);
    }
  }

  // event 触发器入口：当某对象类型发生写入时由平台调用，触发匹配的 event 规则。
  // （Step 2 提供入口，实际接线（监听 object_write）由各业务层按需挂载。）
  // event 触发器入口：当某对象类型发生写入时由平台调用，触发匹配的 event 规则。
  // objectRid / patch 为预留参数：未来可用于基于 r.trigger.conditionProperty 的细粒度匹配过滤，
  // 当前仅按 objectType 粗匹配后交由条件函数评估。
  async handleObjectWrite(objectType: string, objectRid: string, patch: Record<string, unknown>): Promise<RuleEvaluationResult[]> {
    void objectRid;
    void patch;
    const rules = await this.repo.listRules();
    const matched = rules.filter(
      (r) =>
        r.enabled &&
        r.trigger.kind === 'event' &&
        r.trigger.on === 'object_write' &&
        r.trigger.objectType === objectType,
    );
    const now = Date.now();
    return Promise.all(matched.map((r) => this.evaluateRule(r, now)));
  }

  // 手动触发所有规则（API 调用）
  async runAll(): Promise<RuleEvaluationResult[]> {
    const rules = await this.repo.listRules();
    const now = Date.now();
    return Promise.all(rules.map((r) => this.evaluateRule(r, now)));
  }
}
