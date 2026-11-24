import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 前端调用 /api 走 dev server 代理到后端
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // 关键：禁用 http-proxy 对响应的缓冲，否则 SSE 流会被攒齐后一次性转发到前端
        buffer: false,
        configure: (proxy: any) => {
          proxy.on('proxyRes', (proxyRes: any) => {
            const contentType = proxyRes.headers['content-type'] || '';
            if (contentType.includes('text/event-stream')) {
              proxyRes.headers['cache-control'] = 'no-cache, no-transform';
              proxyRes.headers['x-accel-buffering'] = 'no';
              proxyRes.headers['content-encoding'] = '';
            }
          });
        },
      } as any,
    },
  },
});
