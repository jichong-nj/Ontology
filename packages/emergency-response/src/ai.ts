// 应急响应 AI 能力：调用本地 OpenAI 兼容 provider 做抽取/研判。
// 失败时返回空结果，不阻塞主流程。
export interface Extracted {
  summary: string;
  entities: Array<{ entityType: string; value: string; rawText?: string; confidence?: number }>;
}

const BASE = process.env.AIP_BASE_URL || 'http://127.0.0.1:8731/v1';
const MODEL = process.env.AIP_MODEL || 'halogen-qwen3.8-flash-next';
const KEY = process.env.AIP_API_KEY || '';

function parseJson(text: string): any {
  let t = String(text ?? '').trim();
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/g, '').trim();
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return JSON.parse(t);
}

async function chat(system: string, user: string): Promise<string> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}) },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`AI provider ${res.status}`);
  const data: any = await res.json();
  return String(data?.choices?.[0]?.message?.content ?? '');
}

export async function extractFromText(text: string, sourceType: string): Promise<Extracted> {
  const system = `你是涉密事件应急响应的信息抽取助手。只输出 JSON，不要输出其他文字。
JSON 结构：{"summary":"一段话摘要","entities":[{"entityType":"organization|employee|document|clue","value":"实体名称/文号","rawText":"原文片段","confidence":0.0}]}
要求：
1. 摘要不超过 120 字；
2. 只抽取文本中明确出现的单位、人员、文档/文号、线索；
3. 不要臆造；
4. entityType 只能是 organization/employee/document/clue。`;
  const user = `来源类型：${sourceType}\n文本：\n${text}`;
  try {
    const content = await chat(system, user);
    const parsed = parseJson(content);
    return {
      summary: String(parsed.summary ?? '').slice(0, 500),
      entities: Array.isArray(parsed.entities) ? parsed.entities.slice(0, 30).map((e: any) => ({
        entityType: String(e.entityType ?? 'clue'),
        value: String(e.value ?? ''),
        rawText: e.rawText ? String(e.rawText) : '',
        confidence: Number(e.confidence ?? 0.5),
      })).filter((e: any) => e.value) : [],
    };
  } catch (e) {
    console.warn('[emergency] AI 抽取失败，返回空结果:', (e as Error).message);
    return { summary: String(text ?? '').slice(0, 120), entities: [] };
  }
}

export interface AnalysisResult {
  summary: string;
  riskTargets: Array<{ targetType: 'organization' | 'employee'; name: string; score: number; reasons: string[] }>;
  suggestedActions: string[];
}

export async function analyzeCaseText(context: string): Promise<AnalysisResult> {
  const system = `你是涉密事件应急响应研判助手。只输出 JSON，不要输出其他文字。
JSON：{"summary":"案件结论，120字内","riskTargets":[{"targetType":"organization|employee","name":"单位或人员名称","score":0-100,"reasons":["理由"]}],"suggestedActions":["建议动作"]}
要求：
1. 只基于给定数据判断，不臆造；
2. riskTargets 只放单位/人员，不放文档/线索；
3. score 越高越可疑；
4. 如果证据不足，riskTargets 可以为空。`;
  try {
    const content = await chat(system, context);
    const parsed = parseJson(content);
    return {
      summary: String(parsed.summary ?? '').slice(0, 800),
      riskTargets: Array.isArray(parsed.riskTargets) ? parsed.riskTargets.slice(0, 20).map((t: any) => ({
        targetType: t.targetType === 'employee' ? 'employee' : 'organization',
        name: String(t.name ?? ''),
        score: Number(t.score ?? 0),
        reasons: Array.isArray(t.reasons) ? t.reasons.map(String) : [],
      })).filter((t: any) => t.name) : [],
      suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions.map(String) : [],
    };
  } catch (e) {
    console.warn('[emergency] AI 研判失败:', (e as Error).message);
    return { summary: 'AI 研判暂不可用，请基于现有数据人工判断。', riskTargets: [], suggestedActions: [] };
  }
}

export async function generateClosureDraftText(context: string): Promise<string> {
  const system = `你是涉密事件应急响应结案报告撰写助手。根据给定案件数据写一份结案报告，纯文本，不要 JSON。
结构：事件概况、调查过程、涉及单位与人员、发现的问题、处置情况、结论与建议。
要求：客观、简洁、可审计，不臆造；控制在 600 字以内。`;
  try {
    const content = await chat(system, context);
    return content.trim().slice(0, 2000);
  } catch (e) {
    console.warn('[emergency] AI 结案草稿失败:', (e as Error).message);
    return '（AI 草稿生成失败，请手动填写）';
  }
}
