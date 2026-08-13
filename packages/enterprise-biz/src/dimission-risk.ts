// 离职风险分计算函数（OntologyFunction: evaluateDimissionRisk）
// 满分 100 分，按下列规则扣分（可写属性 riskScore / riskLevel，不回写只读源端）：
//   规则1：请假天数(annualLeaveDays) > leaveBase 天的，每多 1 天扣 leaveDeduct 分；
//   规则2：工作时长(workHours) < 部门平均 * threshold 的，每低于部门均值 5% 扣 workDeduct 分。
// 风险等级：>80 不告警；<=80 低风险；<=70 中风险；<=50 高风险。
//
// 本文件同时提供「可在线编辑的函数体」(EXPORTED bodies) 与「内置兜底实现」(make* 闭包)。
// 优先使用元数据库中 FDE 配置的 body（改写后无需改源码/重启，前端保存即生效）；
// 当 DB 中该函数无 body 时，回退到内置闭包，保证冷启动可运行。

import type { FunctionSandbox, MetadataRepository } from '@ontology/ontology-core';
import type { TsFn } from '@ontology/ontology-core';

const LINK_TYPE = 'EmployeeDepartment';

// 分数 -> 风险等级（纯函数，函数体与兜底闭包共用）
export function levelOf(score: number): 'none' | 'low' | 'medium' | 'high' {
  if (score > 80) return 'none';
  if (score <= 50) return 'high';
  if (score <= 70) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// 可在线编辑的函数体（FDE 可在 S2 Functions 面板修改并保存即时生效）
// 约定：body 返回 (args, ctx) => {...}，ctx 提供 repo / objects / links。
// 默认参数均可由 alert_rule.params / 调用 args 覆盖，实现真正的可配置算分。
// ---------------------------------------------------------------------------
export const EVALUATE_DIMISSION_RISK_BODY = `
return async (args, ctx) => {
  const { repo } = ctx;
  const LINK_TYPE = 'EmployeeDepartment';
  const num = (v, d) => (typeof v === 'number' ? v : (v === undefined || v === null ? d : Number(v)));
  const threshold = num(args.threshold, 0.8);
  const leaveDeduct = num(args.leaveDeduct, 10);
  const workDeduct = num(args.workDeduct, 10);
  const leaveBase = num(args.leaveBase, 1);
  const onlyDept = args.departmentId === undefined || args.departmentId === null
    ? null : String(args.departmentId);

  const levelOf = (score) => {
    if (score > 80) return 'none';
    if (score <= 50) return 'high';
    if (score <= 70) return 'medium';
    return 'low';
  };

  // 1) 读取人员实例（含 workHours）与人员-部门关系实例
  const employees = await repo.listObjectProperties('Employee');
  const links = await repo.listLinkInstances(LINK_TYPE); // { sourceRid(Employee), targetRid(Department) }

  // 2) 建立 员工rid -> 部门rid 映射（仅取第一条隶属关系）
  const empDept = new Map();
  for (const l of links) empDept.set(l.sourceRid, l.targetRid);

  // 3) 部门平均工作时长：优先使用派生属性"部门平均上班时间"(avgWorkHours)，失败则本地聚合
  const involvedDepts = new Set();
  for (const e of employees) {
    const dept = empDept.get(e.objectRid);
    if (dept) involvedDepts.add(dept);
  }
  const deptAvg = new Map();
  for (const dept of involvedDepts) {
    if (onlyDept !== null && dept !== onlyDept) continue;
    let avg = 0;
    try {
      const r = await repo.computeDerived('Department', 'avgWorkHours', dept);
      avg = Number(r.value);
    } catch {
      const members = employees.filter((e) => empDept.get(e.objectRid) === dept);
      const ws = members.map((e) => Number(e.properties.workHours)).filter((n) => Number.isFinite(n));
      avg = ws.length ? ws.reduce((a, b) => a + b, 0) / ws.length : 0;
    }
    deptAvg.set(dept, avg);
  }

  // 4) 逐人算分（满分 100，按规则扣分，下限 0）
  const flagged = [];
  const actor = 'function:evaluateDimissionRisk';
  for (const e of employees) {
    const dept = empDept.get(e.objectRid);
    if (!dept) continue;
    if (onlyDept !== null && dept !== onlyDept) continue;

    // 请假天数来自派生属性 annualLeaveDays（sumLinks 实时聚合，不落库），需动态计算
    let leave = 0;
    try {
      const r = await repo.computeDerived('Employee', 'annualLeaveDays', e.objectRid);
      leave = Number(r.value);
    } catch { leave = 0; }

    let score = 100;
    const wh = Number(e.properties.workHours);
    const avg = deptAvg.get(dept) ?? 0;

    // 规则1：请假 > leaveBase 天，每多 1 天扣 leaveDeduct
    if (leave > leaveBase) score -= (leave - leaveBase) * leaveDeduct;

    // 规则2：工作时长 < 部门平均*阈值 的，每低于 5% 扣 workDeduct
    if (Number.isFinite(wh) && avg > 0 && wh < avg * threshold) {
      const belowPct = (avg * threshold - wh) / (avg * 0.05); // 低于百分点的个数（每 5% 一个）
      score -= belowPct * workDeduct;
    }

    score = Math.max(0, Math.round(score));
    const level = levelOf(score);
    const name = typeof e.properties.name === 'string' ? e.properties.name : undefined;

    await repo.writeObjectPatch('Employee', e.objectRid, { riskScore: score, riskLevel: level }, actor);

    // 仅当风险等级命中（<=80）才进入告警候选
    if (level !== 'none') {
      flagged.push({ rid: e.objectRid, name, workHours: wh, deptAvg: avg, annualLeaveDays: leave, score, level });
    }
  }

  return {
    threshold,
    leaveDeduct,
    workDeduct,
    leaveBase,
    departmentAverages: Object.fromEntries([...deptAvg.entries()].map(([k, v]) => [k, Number(v.toFixed(2))])),
    flaggedCount: flagged.length,
    flagged,
  };
};`;

// 内置兜底实现：当元数据库中 evaluateDimissionRisk 无 body 时使用（保证冷启动可运行）
export function makeEvaluateDimissionRisk(repo: MetadataRepository): TsFn {
  return async (args: Record<string, unknown>) => {
    const threshold = typeof args.threshold === 'number' ? args.threshold : 0.8;
    const onlyDept = typeof args.departmentId === 'number' ? args.departmentId : null;

    // 1) 读取人员实例（含 workHours、annualLeaveDays）与人员-部门关系实例
    const employees = await repo.listObjectProperties('Employee');
    const links = await repo.listLinkInstances(LINK_TYPE); // { sourceRid(Employee), targetRid(Department) }

    // 2) 建立 员工rid -> 部门rid 映射（仅取第一条隶属关系）
    const empDept = new Map<string, string>();
    for (const l of links) empDept.set(l.sourceRid, l.targetRid);

    // 3) 部门平均工作时长：优先使用已配置的派生属性"部门平均上班时间"(avgWorkHours)，
    //    失败则退化为本地聚合，保证函数健壮性。
    const involvedDepts = new Set<string>();
    for (const e of employees) {
      const dept = empDept.get(e.objectRid);
      if (dept) involvedDepts.add(dept);
    }
    const deptAvg = new Map<string, number>();
    for (const dept of involvedDepts) {
      if (onlyDept !== null && dept !== String(onlyDept)) continue;
      let avg = 0;
      try {
        const r = await repo.computeDerived('Department', 'avgWorkHours', dept);
        avg = Number(r.value);
      } catch {
        const members = employees.filter((e) => empDept.get(e.objectRid) === dept);
        const ws = members.map((e) => Number(e.properties.workHours)).filter((n) => Number.isFinite(n));
        avg = ws.length ? ws.reduce((a, b) => a + b, 0) / ws.length : 0;
      }
      deptAvg.set(dept, avg);
    }

    // 4) 逐人算分（满分 100，按规则扣分，下限 0）
    const flagged: Array<{ rid: string; name?: string; workHours: number; deptAvg: number; annualLeaveDays: number; score: number; level: string }> = [];
    const actor = 'function:evaluateDimissionRisk';
    for (const e of employees) {
      const dept = empDept.get(e.objectRid);
      if (!dept) continue;
      if (onlyDept !== null && dept !== String(onlyDept)) continue;

      // 请假天数来自派生属性 annualLeaveDays（sumLinks 实时聚合，不落库），需动态计算
      let leave = 0;
      try {
        const r = await repo.computeDerived('Employee', 'annualLeaveDays', e.objectRid);
        leave = Number(r.value);
      } catch {
        leave = 0;
      }

      let score = 100;
      const wh = Number(e.properties.workHours);
      const avg = deptAvg.get(dept) ?? 0;

      // 规则1：请假 > 1 天，每多 1 天扣 10
      if (leave > 1) score -= (leave - 1) * 10;

      // 规则2：工作时长 < 部门平均*阈值 的，每低于 5% 扣 10
      if (Number.isFinite(wh) && avg > 0 && wh < avg * threshold) {
        const belowPct = (avg * threshold - wh) / (avg * 0.05); // 低于百分点的个数（每 5% 一个）
        score -= belowPct * 10;
      }

      score = Math.max(0, Math.round(score));
      const level = levelOf(score);
      const name = typeof e.properties.name === 'string' ? e.properties.name : undefined;

      await repo.writeObjectPatch('Employee', e.objectRid, { riskScore: score, riskLevel: level }, actor);

      // 仅当风险等级命中（<=80）才进入告警候选
      if (level !== 'none') {
        flagged.push({ rid: e.objectRid, name, workHours: wh, deptAvg: avg, annualLeaveDays: leave, score, level });
      }
    }

    return {
      threshold,
      departmentAverages: Object.fromEntries(
        [...deptAvg.entries()].map(([k, v]) => [k, Number(v.toFixed(2))]),
      ),
      flaggedCount: flagged.length,
      flagged,
    };
  };
}

// 注册到函数沙箱（bootstrap / buildSandbox 时调用）。
// 仅作「兜底」：若沙箱里该函数已被 DB 中的 body 版本注册(registerDbFunctions 优先)，
// 则不覆盖；否则注入内置闭包，保证冷启动可运行。
export function registerDimissionRisk(sandbox: FunctionSandbox, repo: MetadataRepository): void {
  if (!sandbox.has('evaluateDimissionRisk')) {
    sandbox.register('evaluateDimissionRisk', makeEvaluateDimissionRisk(repo));
  }
  if (!sandbox.has('createDimissionAlert')) {
    sandbox.register('createDimissionAlert', makeCreateDimissionAlert(repo));
  }
}

// ---------------------------------------------------------------------------
// 可在线编辑的动作函数体（createDimissionAlert）：将命中人员生成为 Alert 对象。
// 参数 rule / alertObjectType / flagged 由调度器从 evaluateDimissionRisk 结果透传。
// ---------------------------------------------------------------------------
export const CREATE_DIMISSION_ALERT_BODY = `
return async (args, ctx) => {
  const { repo } = ctx;
  const rule = String(args.rule ?? 'unknown-rule');
  const alertObjectType = String(args.alertObjectType ?? 'Alert');
  const flagged = Array.isArray(args.flagged) ? args.flagged : [];
  const created = [];
  const actor = 'action:createDimissionAlert';

  const levelText = { low: '低风险', medium: '中风险', high: '高风险' };

  for (const f of flagged) {
    const subjectRid = String(f.rid);
    const level = String(f.level ?? 'low');
    const rid = 'alert-' + rule + '-' + subjectRid;
    const score = Number(f.score);
    await repo.writeObjectPatch(alertObjectType, rid, {
      id: rid,
      ruleApiName: rule,
      subjectType: 'Employee',
      subjectRid,
      subjectName: f.name ? String(f.name) : subjectRid,
      level,
      message: '离职风险分 ' + score + '（' + (levelText[level] ?? level) + '）：请假' + Number(f.annualLeaveDays) + '天、日均工时' + Number(f.workHours).toFixed(1) + 'h（部门均值' + Number(f.deptAvg).toFixed(1) + 'h）',
      createdAt: new Date().toISOString(),
    }, actor);
    created.push({ rid, subjectRid, level });
  }
  return { created };
};`;

// 内置兜底实现：当元数据库中 createDimissionAlert 无 body 时使用（保证冷启动可运行）。
// 动作实现：将条件命中的人员（已带 score/level）生成为 Alert 告警对象（写入本体可写侧 object_write）。
// 与「评估函数」解耦——规则只引用 actionApiName，可热替换为其他落地动作。
export function makeCreateDimissionAlert(repo: MetadataRepository): TsFn {
  return async (args: Record<string, unknown>) => {
    const rule = String(args.rule ?? 'unknown-rule');
    const alertObjectType = String(args.alertObjectType ?? 'Alert');
    const flagged = Array.isArray(args.flagged) ? (args.flagged as Array<Record<string, unknown>>) : [];
    const created: Array<{ rid: string; subjectRid: string; level: string }> = [];
    const actor = `action:createDimissionAlert`;

    const levelText: Record<string, string> = { low: '低风险', medium: '中风险', high: '高风险' };

    for (const f of flagged) {
      const subjectRid = String(f.rid);
      const level = String(f.level ?? 'low');
      const rid = `alert-${rule}-${subjectRid}`;
      const score = Number(f.score);
      await repo.writeObjectPatch(alertObjectType, rid, {
        id: rid,
        ruleApiName: rule,
        subjectType: 'Employee',
        subjectRid,
        subjectName: f.name ? String(f.name) : subjectRid,
        level,
        message: `离职风险分 ${score}（${levelText[level] ?? level}）：请假${Number(f.annualLeaveDays)}天、日均工时${Number(f.workHours).toFixed(1)}h（部门均值${Number(f.deptAvg).toFixed(1)}h）`,
        createdAt: new Date().toISOString(),
      }, actor);
      created.push({ rid, subjectRid, level });
    }
    return { created };
  };
}
