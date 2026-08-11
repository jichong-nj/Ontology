import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/src/**/*.test.ts'],
    // 真实 PG 集成测试，串行避免表竞争
    fileParallelism: false,
    hookTimeout: 20000,
    testTimeout: 20000,
  },
});
