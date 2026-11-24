// 声明式规则条件求值：property / aggregate / all / any / function
import type { MetadataRepository, RuleCondition } from './types';

export interface RuleConditionResult {
  matched: boolean;
  items: Array<Record<string, unknown> & { rid?: string }>;
}

export type RunConditionFunction = (name: string, args: Record<string, unknown>) => Promise<unknown>;

function extractFlagged(output: unknown): Array<Record<string, unknown>> {
  if (!output || typeof output !== 'object') return [];
  const o = output as Record<string, unknown>;
  for (const key of ['flagged', 'flaggedEmployees', 'matches', 'items']) {
    if (Array.isArray(o[key])) return o[key] as Array<Record<string, unknown>>;
  }
  return [];
}

function compare(op: string, left: number, right: number): boolean {
  switch (op) {
    case 'gt': return left > right;
    case 'gte': return left >= right;
    case 'lt': return left < right;
    case 'lte': return left <= right;
    case 'eq': return left === right;
    case 'neq': return left !== right;
    default: return false;
  }
}

function flatten(item: { objectRid: string; properties: Record<string, unknown> }): Record<string, unknown> & { rid: string } {
  return { rid: item.objectRid, ...(item.properties ?? {}) };
}

function intersect(sets: Array<Array<Record<string, unknown>>>): Array<Record<string, unknown>> {
  if (!sets.length) return [];
  const [first, ...rest] = sets;
  return first.filter((item) => {
    const rid = (item as any).rid ?? (item as any).objectRid;
    return rest.every((s) => s.some((x) => ((x as any).rid ?? (x as any).objectRid) === rid));
  });
}

function union(sets: Array<Array<Record<string, unknown>>>): Array<Record<string, unknown>> {
  const byRid = new Map<string, Record<string, unknown>>();
  for (const set of sets) {
    for (const item of set) {
      const rid = String((item as any).rid ?? (item as any).objectRid ?? JSON.stringify(item));
      if (!byRid.has(rid)) byRid.set(rid, item);
    }
  }
  return [...byRid.values()];
}

export async function evaluateRuleCondition(
  repo: MetadataRepository,
  cond: RuleCondition,
  runFunction: RunConditionFunction,
  fallbackParams?: Record<string, unknown>,
): Promise<RuleConditionResult> {
  switch (cond.kind) {
    case 'function': {
      const output = await runFunction(cond.function, cond.params ?? fallbackParams ?? {});
      const items = extractFlagged(output);
      return { matched: items.length > 0, items };
    }
    case 'property': {
      const res = await repo.listInstances(cond.objectType, {
        filter: [{ property: cond.property, operator: cond.operator, value: cond.value }],
        pageSize: 1000,
      });
      const items = res.data.map(flatten);
      return { matched: items.length > 0, items };
    }
    case 'aggregate': {
      const value = await repo.aggregateScalar(cond.objectType, {
        aggregation: cond.aggregation,
        property: cond.property,
      });
      return { matched: compare(cond.operator, value, Number(cond.value)), items: [] };
    }
    case 'all': {
      if (!cond.conditions.length) return { matched: false, items: [] };
      const results = [];
      for (const sub of cond.conditions) results.push(await evaluateRuleCondition(repo, sub, runFunction, fallbackParams));
      const itemSets = results.map((r) => r.items).filter((items) => items.length > 0);
      return {
        matched: results.every((r) => r.matched),
        items: intersect(itemSets) as any,
      };
    }
    case 'any': {
      if (!cond.conditions.length) return { matched: false, items: [] };
      const results = [];
      for (const sub of cond.conditions) results.push(await evaluateRuleCondition(repo, sub, runFunction, fallbackParams));
      return {
        matched: results.some((r) => r.matched),
        items: union(results.map((r) => r.items).filter((items) => items.length > 0)) as any,
      };
    }
    default:
      throw new Error(`不支持的条件类型: ${(cond as any).kind}`);
  }
}
