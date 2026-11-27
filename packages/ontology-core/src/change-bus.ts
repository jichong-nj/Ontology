// 进程内对象写入事件总线：writeObjectPatch 成功后发布，供调度器等订阅方消费。
// 说明：只覆盖"平台自身写入"（同步 / 动作 / 函数），源库直接变更不会触发（需同步/CDC 拉取）。
export interface ObjectWriteEvent {
  objectType: string;
  objectRid: string;
  patch: Record<string, unknown>;
  actor: string;
  at: number;
  // 变更类型与前后值
  changeType?: 'created' | 'updated' | 'deleted';
  beforePatch?: Record<string, unknown> | null;
  afterPatch?: Record<string, unknown>;
  // 自动化链路（动作/函数写入时携带）
  chain?: { chainId: string; depth: number; path: string[] };
}

export type ObjectWriteListener = (e: ObjectWriteEvent) => void;

const listeners = new Set<ObjectWriteListener>();

export function onObjectWrite(listener: ObjectWriteListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitObjectWrite(e: ObjectWriteEvent): void {
  for (const listener of listeners) {
    try {
      listener(e);
    } catch {
      // 监听器异常不应影响写入本身
    }
  }
}
