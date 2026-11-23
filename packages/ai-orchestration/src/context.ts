// 上下文预算管理：给对话历史做"滑动窗口"裁剪，避免超出模型上下文。
// 策略（A 方案）：保留最早 1 条用户消息（原始意图）+ 从近到远填入预算内的消息；
// 预算 = contextWindow * ratio - 输出预留 - 系统提示/当前消息预留。
import type { ChatMessage } from './llm-gateway';

// 粗略 token 估算：中文约 1.5 字/token，英文约 4 字/token；统一按 1.5 保守估算。
export function estimateTokens(text: string): number {
  return Math.ceil((text ?? '').length / 1.5);
}

export function trimHistory(
  history: ChatMessage[],
  opts: {
    contextWindow?: number | null;
    maxTokens?: number | null;
    reservedTokens?: number;
    ratio?: number;
  } = {},
): ChatMessage[] {
  if (!history.length) return history;
  const ctx = opts.contextWindow && opts.contextWindow > 0 ? opts.contextWindow : 32768;
  const ratio = opts.ratio ?? 0.6;
  const outTokens = Math.min(Math.max(opts.maxTokens ?? 4096, 256), 32768);
  const budget = Math.floor(ctx * ratio) - outTokens - (opts.reservedTokens ?? 0);

  // 预算过小：只保留最后一条用户消息，保证对话还能继续
  if (budget <= 0) {
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    return lastUser ? [lastUser] : [];
  }

  const used = history.reduce((n, m) => n + estimateTokens(String(m.content ?? '')), 0);
  if (used <= budget) return history;

  const firstUser = history.find((m) => m.role === 'user');
  let acc = firstUser ? estimateTokens(String(firstUser.content ?? '')) : 0;
  const tail: ChatMessage[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (firstUser && m === firstUser) break;
    const t = estimateTokens(String(m.content ?? ''));
    if (acc + t > budget) break;
    acc += t;
    tail.unshift(m);
  }
  // 裁剪后的历史必须以 user 开头（避免 assistant 孤立开头）
  while (tail.length && tail[0].role !== 'user') tail.shift();
  return firstUser ? [firstUser, ...tail] : tail;
}
