// 告警调度器（后台定时任务）
// 周期执行「可配置的告警规则」：调用规则指定的 Function 评估条件，
// 当返回命中对象时，调用规则指定的 Action 生成告警对象（写入本体可写侧）。
//
// 设计要点（对标 Palantir Foundry Ontology 的「Actions + Functions + Scheduling」）：
// - Function 可配置：规则只引用 functionApiName，逻辑与调度解耦，可热替换。
// - Action 可配置：命中后由 actionApiName 决定「生成什么告警对象、写到哪个类型」。
// - 源端只读，告警对象只写本体可写侧（object_write），不回写数据源。
import type { MetadataRepository, FunctionSandbox, AlertRule } from './types';

export interface AlertSchedulerOptions {
  // 轮询间隔（毫秒）；规则自身的 intervalSeconds 决定各自执行频率
  tickMs?: number;
}

// 一次规则执行的结果（供可观测/测试断言）
export interface AlertEvaluationResult {
  rule: string;
  ran: boolean;
  error?: string;
  flaggedCount: number;
  alertsCreated: number;
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

export class AlertScheduler {
  private timer: NodeJS.Timeout | null = null;
  private lastRanAt = new Map<string, number>();
  private running = new Map<string, boolean>();
  private tickMs: number;
  private repo: MetadataRepository;
  private sandbox: FunctionSandbox;

  constructor(repo: MetadataRepository, sandbox: FunctionSandbox, opts: AlertSchedulerOptions = {}) {
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
    const rules = await this.repo.listAlertRules();
    const now = Date.now();
    await Promise.all(rules.map((r) => this.evaluateRule(r, now)));
  }

  // 单次规则评估（可被 API 手动触发）
  async evaluateRule(rule: AlertRule, now = Date.now()): Promise<AlertEvaluationResult> {
    const base: AlertEvaluationResult = {
      rule: rule.apiName, ran: false, flaggedCount: 0, alertsCreated: 0,
    };
    if (!rule.enabled) return base;
    // 节流：未到周期则跳过（now 用于测试可注入）
    const last = this.lastRanAt.get(rule.apiName) ?? 0;
    if (now - last < rule.intervalSeconds * 1000) return base;
    if (this.running.get(rule.apiName)) return base;
    this.running.set(rule.apiName, true);
    this.lastRanAt.set(rule.apiName, now);

    try {
      // 1) 可配置 Function：评估条件
      const output = await this.sandbox.execute(rule.functionApiName, rule.params ?? {});
      const flagged = extractFlagged(output);
      base.ran = true;
      base.flaggedCount = flagged.length;
      if (flagged.length === 0) return base;

      // 2) 可配置 Action：生成告警对象
      const action = await this.repo.getAction(rule.actionApiName);
      if (!action) {
        base.error = `规则引用的 Action 未注册: ${rule.actionApiName}`;
        return base;
      }
      const res = await this.sandbox.execute(rule.actionApiName, {
        rule: rule.apiName,
        alertObjectType: rule.alertObjectType,
        flagged,
      });
      const created = Array.isArray((res as any)?.created) ? (res as any).created.length : flagged.length;
      base.alertsCreated = created;
      return base;
    } catch (e: any) {
      base.error = e?.message ?? String(e);
      return base;
    } finally {
      this.running.set(rule.apiName, false);
    }
  }

  // 手动触发所有规则（API 调用）
  async runAll(): Promise<AlertEvaluationResult[]> {
    const rules = await this.repo.listAlertRules();
    const now = Date.now();
    return Promise.all(rules.map((r) => this.evaluateRule(r, now)));
  }
}
