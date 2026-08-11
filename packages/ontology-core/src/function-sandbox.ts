// S2 Ontology 内核 — TypeScript 函数沙箱（第一期唯一可执行运行时）
// 分期（见 S2 F2.6）：仅 language='typescript' 被执行；python 由调用方（engine）拦截返回"未实现"。
// 此处以"按 entry 注册的可调用函数表"模拟沙箱隔离执行，真实环境应替换为 @isolated-vm / VM 资源隔离。
import type { FunctionSandbox, TsFn } from './types';

export type { TsFn };

export class TypeScriptFunctionSandbox implements FunctionSandbox {
  private registry = new Map<string, TsFn>();

  register(apiName: string, fn: TsFn): void {
    this.registry.set(apiName, fn);
  }

  async execute(fnApiName: string, args: Record<string, unknown>): Promise<unknown> {
    const fn = this.registry.get(fnApiName);
    if (!fn) throw new Error(`未注册的函数实现: ${fnApiName}`);
    return fn(args);
  }
}
