// 兼容解析：部分本地模型（Qwen 系列）会把工具调用以 XML 文本形式输出：
//   <tool_call><function=xxx><parameter=a>1</parameter></function></tool_call>
// 当模型网关没有把它解析成 tool_calls 时，用它兜底转换。
import type { ToolCall } from './llm-gateway';

export interface ParsedXmlToolCalls {
  calls: ToolCall[];
  cleaned: string;
}

function parseScalar(raw: string): unknown {
  const s = (raw ?? '').trim();
  if (!s) return '';
  if (/^(true|false)$/i.test(s)) return s.toLowerCase() === 'true';
  if (/^null$/i.test(s)) return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
    try { return JSON.parse(s); } catch { /* 保留字符串 */ }
  }
  return s;
}

// 剥离残留的 XML 工具调用片段（完整块或未闭合的截断块）
export function stripToolCallXml(content: string): string {
  let out = (content ?? '')
    .replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '')
    .replace(/<function=[^\s>]+\s*>[\s\S]*?<\/function>/g, '');
  const idx = out.indexOf('<tool_call');
  if (idx >= 0) out = out.slice(0, idx);
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

export function parseXmlToolCalls(content: string): ParsedXmlToolCalls {
  const src = content ?? '';
  if (!src.includes('<tool_call')) return { calls: [], cleaned: src };
  const calls: ToolCall[] = [];
  let cleaned = src;
  const callRe = /<tool_call>([\s\S]*?)<\/tool_call>/g;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = callRe.exec(src)) !== null) {
    const body = m[1] ?? '';
    const fm = /<function=([^\s>]+)\s*>([\s\S]*?)<\/function>/.exec(body);
    if (!fm) continue;
    const name = fm[1].trim();
    const args: Record<string, unknown> = {};
    const pRe = /<parameter=([^\s>]+)\s*>([\s\S]*?)<\/parameter>/g;
    let pm: RegExpExecArray | null;
    while ((pm = pRe.exec(fm[2] ?? '')) !== null) {
      args[pm[1].trim()] = parseScalar(pm[2]);
    }
    calls.push({
      id: `xml_${Date.now().toString(36)}_${n++}`,
      type: 'function',
      function: { name, arguments: JSON.stringify(args) },
    });
    cleaned = cleaned.replace(m[0], '');
  }
  return { calls, cleaned: cleaned.replace(/\n{3,}/g, '\n\n').trim() };
}
