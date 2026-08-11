// S2 Ontology 内核 — 接口方法运行时引擎（多态分派 + 沙箱执行）
// 骨架占位：演示调用链路 对象实例 → 接口方法 → 绑定 Function → 沙箱执行。
// 依赖 MetadataRepository（解析绑定）与 FunctionSandbox（隔离执行）。

import {
  InterfaceMethodEngine,
  MethodInvocationContext,
  MethodInvocationResult,
  MetadataRepository,
  FunctionSandbox,
} from './types';

export class DefaultInterfaceMethodEngine implements InterfaceMethodEngine {
  constructor(
    private repo: MetadataRepository,
    private sandbox: FunctionSandbox,
  ) {}

  async resolve(ctx: MethodInvocationContext): Promise<string | null> {
    return this.repo.resolveInterfaceMethod(ctx.objectType, ctx.interfaceApi, ctx.methodApi);
  }

  async invoke(ctx: MethodInvocationContext): Promise<MethodInvocationResult> {
    // 1. 多态解析：按对象类型找到应执行的 OntologyFunction
    const fnApi = await this.repo.resolveInterfaceMethod(
      ctx.objectType, ctx.interfaceApi, ctx.methodApi,
    );
    if (!fnApi) {
      return {
        ok: false,
        error: `No implementation bound for ${ctx.interfaceApi}.${ctx.methodApi} on ${ctx.objectType}`,
      };
    }
    // 2. 沙箱执行（资源/IO 受限，详见 S2 F2.6）
    //    运行时分期（见 S2 F2.6 / S5 F5.2）：
    //    - resolve 阶段对 python 函数仍返回其 apiName（可见、可规划）；
    //    - invoke/execute 阶段仅支持 language='typescript'，python 由 FunctionSandbox 返回"未实现"。
    try {
      const value = await this.sandbox.execute(fnApi, ctx.args);
      return { ok: true, value, executedFunction: fnApi };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e), executedFunction: fnApi };
    }
  }
}
