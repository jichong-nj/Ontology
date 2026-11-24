// 进程内对象写入事件总线：writeObjectPatch 成功后发布，供调度器等订阅方消费。
// 说明：只覆盖"平台自身写入"（同步 / 动作 / 函数），源库直接变更不会触发（需同步/CDC 拉取）。
export interface ObjectWriteEvent {
  objectType: string;
  objectRid: string;
  patch: Record<string, unknown>;
  actor: string;
  at: number;
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
