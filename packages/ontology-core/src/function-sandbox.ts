// S2 Ontology 内核 — TypeScript 函数沙箱（第一期唯一可执行运行时）
// 分期（见 S2 F2.6）：仅 language='typescript' 被执行；python 由调用方（engine）拦截返回"未实现"。
// 此处以"按 entry 注册的可调用函数表"模拟沙箱隔离执行，真实环境应替换为 @isolated-vm / VM 资源隔离。
import type { FunctionSandbox, TsFn } from './types';

export type { TsFn };

// 函数执行上下文：注入本体访问能力，供存库可编辑的函数体消费。
// 约定函数体形式： (args, ctx) => { ... } 或 (args, ctx) => { return ... }
export interface FunctionContext {
  repo: import('./types').MetadataRepository;
  // 便捷读取：某对象类型全部实例属性
  objects: (objectType: string) => Promise<Array<{ objectRid: string; properties: Record<string, unknown> }>>;
  // 便捷读取：某关系类型的全部实例
  links: (linkType: string) => Promise<Array<{ sourceRid: string; targetRid: string }>>;
}

export class TypeScriptFunctionSandbox implements FunctionSandbox {
  private registry = new Map<string, TsFn>();
  private ctx: FunctionContext | null = null;

  // 注入函数上下文（server 启动时注入 repo）
  setContext(ctx: FunctionContext): void {
    this.ctx = ctx;
  }

  register(apiName: string, fn: TsFn): void {
    this.registry.set(apiName, fn);
  }

  // 从存库的 TS 源码编译注册。约定 body 为：return (args, ctx) => { ...; return ... }
  // 其中 ctx 为运行时注入的 FunctionContext（含 repo / objects / links）。
  registerFromSource(apiName: string, body: string): void {
    if (!this.ctx) throw new Error('沙箱未注入上下文，无法注册源码函数');
    const outer = new Function(body) as (...a: unknown[]) => (args: unknown, ctx: FunctionContext) => unknown;
    const fnWithCtx = outer();
    const fn: TsFn = (args) => fnWithCtx(args, this.ctx as FunctionContext);
    this.registry.set(apiName, fn);
  }

  async execute(fnApiName: string, args: Record<string, unknown>): Promise<unknown> {
    const fn = this.registry.get(fnApiName);
    if (!fn) throw new Error(`未注册的函数实现: ${fnApiName}`);
    return fn(args);
  }
}
