import { ElMessage } from 'element-plus';

export async function tryRequest(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (e: any) {
    ElMessage.error(e?.message || '请求失败');
    console.error(e);
  }
}
