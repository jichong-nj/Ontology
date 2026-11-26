import { AsyncLocalStorage } from 'node:async_hooks';

// 自动化执行链上下文：动作/函数写对象时，把链路带进 object_write 事件，
// 下游 automation 据此做深度限制与循环检测。
export interface AutomationContext {
  chainId: string;
  depth: number;
  path: string[];
}

const storage = new AsyncLocalStorage<AutomationContext>();

export function runWithAutomationContext<T>(ctx: AutomationContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getAutomationContext(): AutomationContext | undefined {
  return storage.getStore();
}
