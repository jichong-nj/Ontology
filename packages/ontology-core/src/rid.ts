// RID（对象实例标识）命名空间工具
// 约定：RID = `${对象类型apiName}:${原始主键值}`，如 Department:2、Employee:E0001。
// 目的：不同对象类型的主键值可能重叠（Department.id=2 / Organization.id=2），
//       带类型前缀后 RID 全局唯一，任何按 RID 直查的接口都不会跨类型串扰。

export function rid(type: string, id: string | number): string {
  return `${type}:${String(id)}`;
}

export function ridParts(r: string): { type: string; id: string } {
  const i = (r ?? '').indexOf(':');
  if (i < 0) return { type: '', id: r ?? '' };
  return { type: r.slice(0, i), id: r.slice(i + 1) };
}

// 幂等规范化：裸 RID 补类型前缀；已带前缀则原样返回
export function ensureRid(type: string, r: string): string {
  return (r ?? '').includes(':') ? r : rid(type, r);
}
