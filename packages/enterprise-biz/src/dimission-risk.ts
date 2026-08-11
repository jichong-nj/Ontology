// 离职风险预警函数实现（OntologyFunction: evaluateDimissionRisk）
// 业务规则：对每个部门，计算其所有人员的日均上班时间（workHours）均值；
// 若某人员的 workHours < 部门均值 * 阈值（默认 0.8，即 80%），
// 则判定为离职高风险，并通过 repo.writeObjectPatch 修改该人员实例的
// dimissionRisk 属性（写入本体可写侧 object_write，不回写只读源端）。
//
// 该函数通过 FunctionSandbox 注册执行，符合 S2/F2.6 的"函数触发属性 modify"模式。

import type { FunctionSandbox, MetadataRepository } from '@ontology/ontology-core';
import type { TsFn } from '@ontology/ontology-core';

const LINK_TYPE = 'EmployeeDepartment';
const DEFAULT_THRESHOLD = 0.8;

export function makeEvaluateDimissionRisk(repo: MetadataRepository): TsFn {
  return async (args: Record<string, unknown>) => {
    const threshold = typeof args.threshold === 'number' ? args.threshold : DEFAULT_THRESHOLD;
    const onlyDept = typeof args.departmentId === 'number' ? args.departmentId : null;

    // 1) 读取人员实例（含 workHours、departmentId）与人员-部门关系实例
    const employees = await repo.listObjectProperties('Employee');
    const links = await repo.listLinkInstances(LINK_TYPE); // { sourceRid(Employee), targetRid(Department) }

    // 2) 建立 员工rid -> 部门rid 映射（仅取第一条隶属关系）
    const empDept = new Map<string, string>();
    for (const l of links) empDept.set(l.sourceRid, l.targetRid);

    // 3) 部门均值：优先使用已配置的派生属性"部门平均上班时间"(avgWorkHours)，
    //    —— 即 Department.avgWorkHours 由 avgLinks 算子实时计算，体现"配置了部门平均上班时间"。
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
        // 退化：本地聚合
        const members = employees.filter((e) => empDept.get(e.objectRid) === dept);
        const ws = members.map((e) => Number(e.properties.workHours)).filter((n) => Number.isFinite(n));
        avg = ws.length ? ws.reduce((a, b) => a + b, 0) / ws.length : 0;
      }
      deptAvg.set(dept, avg);
    }

    // 4) 逐人评估：低于 部门均值 * 阈值 -> 标记 dimissionRisk=true
    const flagged: Array<{ rid: string; workHours: number; deptAvg: number; threshold: number }> = [];
    const actor = 'function:evaluateDimissionRisk';
    for (const e of employees) {
      const dept = empDept.get(e.objectRid);
      if (!dept) continue;
      if (onlyDept !== null && dept !== String(onlyDept)) continue;
      const wh = Number(e.properties.workHours);
      const avg = deptAvg.get(dept) ?? 0;
      if (!Number.isFinite(wh) || avg <= 0) continue;
      if (wh < avg * threshold) {
        await repo.writeObjectPatch('Employee', e.objectRid, { dimissionRisk: true }, actor);
        flagged.push({ rid: e.objectRid, workHours: wh, deptAvg: avg, threshold });
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

// 注册到函数沙箱（在 bootstrap 时调用，闭包捕获 repo）
export function registerDimissionRisk(sandbox: FunctionSandbox, repo: MetadataRepository): void {
  sandbox.register('evaluateDimissionRisk', makeEvaluateDimissionRisk(repo));
  sandbox.register('createDimissionAlert', makeCreateDimissionAlert(repo));
}

// 动作实现：将条件命中的人员生成为 Alert 告警对象（写入本体可写侧 object_write）。
// 与「评估函数」解耦——规则只引用 actionApiName，可热替换为其他落地动作。
export function makeCreateDimissionAlert(repo: MetadataRepository): TsFn {
  return async (args: Record<string, unknown>) => {
    const rule = String(args.rule ?? 'unknown-rule');
    const alertObjectType = String(args.alertObjectType ?? 'Alert');
    const flagged = Array.isArray(args.flagged) ? (args.flagged as Array<Record<string, unknown>>) : [];
    const created: Array<{ rid: string; subjectRid: string }> = [];
    const actor = `action:createDimissionAlert`;

    for (const f of flagged) {
      const subjectRid = String(f.rid);
      const rid = `alert-${rule}-${subjectRid}`;
      await repo.writeObjectPatch(alertObjectType, rid, {
        id: rid,
        ruleApiName: rule,
        subjectType: 'Employee',
        subjectRid,
        subjectName: f.name ? String(f.name) : subjectRid,
        level: 'high',
        message: `日均工时 ${Number(f.workHours).toFixed(1)}h，低于部门均值${(Number(f.threshold) * 100).toFixed(0)}% 阈值`,
        createdAt: new Date().toISOString(),
      }, actor);
      created.push({ rid, subjectRid });
    }
    return { created };
  };
}
