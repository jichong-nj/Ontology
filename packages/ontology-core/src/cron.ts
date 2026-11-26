// 轻量 5 字段 cron 解析（分钟 时 日 月 周），支持 * , - / 与周 0-7
function parseField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of field.split(',')) {
    const [range, stepRaw] = part.split('/');
    const step = stepRaw ? Number(stepRaw) : 1;
    if (!Number.isFinite(step) || step <= 0) throw new Error(`非法 cron 步长: ${part}`);
    let lo = min, hi = max;
    if (range !== '*') {
      if (range.includes('-')) {
        const [a, b] = range.split('-').map(Number);
        lo = a; hi = b;
      } else {
        lo = hi = Number(range);
      }
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo < min || hi > max || lo > hi) {
      throw new Error(`非法 cron 字段: ${part}`);
    }
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return out;
}

export interface ParsedCron {
  minutes: Set<number>;
  hours: Set<number>;
  daysOfMonth: Set<number>;
  months: Set<number>;
  daysOfWeek: Set<number>;
}

export function parseCron(expr: string): ParsedCron {
  const parts = (expr ?? '').trim().split(/\s+/);
  if (parts.length !== 5) throw new Error('cron 需要 5 个字段：分 时 日 月 周');
  return {
    minutes: parseField(parts[0], 0, 59),
    hours: parseField(parts[1], 0, 23),
    daysOfMonth: parseField(parts[2], 1, 31),
    months: parseField(parts[3], 1, 12),
    daysOfWeek: parseField(parts[4], 0, 7),
  };
}

export function isCronExpression(expr: string): boolean {
  try { parseCron(expr); return true; } catch { return false; }
}

// 判断某个时刻是否命中 cron（按本地时区）
export function cronMatches(expr: string, date: Date): boolean {
  const c = parseCron(expr);
  const dow = date.getDay() === 0 ? 7 : date.getDay(); // 0/7 都表示周日
  return c.minutes.has(date.getMinutes())
    && c.hours.has(date.getHours())
    && c.months.has(date.getMonth() + 1)
    && (c.daysOfWeek.has(date.getDay()) || c.daysOfWeek.has(dow) || c.daysOfWeek.has(7))
    && c.daysOfMonth.has(date.getDate());
}

export function cronMinuteKey(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}
