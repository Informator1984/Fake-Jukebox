import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult, QaAnswer, AnswerMode } from "@/types/analysis";
import { SYSTEM_PROMPT, buildAnalysisPrompt, buildQaPrompt } from "./prompts";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY nicht konfiguriert.");
  return new Anthropic({ apiKey });
}

function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
}

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd !== -1) {
    return text.slice(braceStart, braceEnd + 1);
  }
  return text.trim();
}

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  const client = getClient();
  const prompt = buildAnalysisPrompt(text);

  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    throw new Error(
      `LLM-Antwort konnte nicht als JSON geparst werden: ${raw.slice(0, 200)}`
    );
  }

  const units = (
    (parsed.documentation_units as Record<string, unknown>[]) || []
  ).map((u, i) => ({
    id: (u.id as string) || `de-${i + 1}`,
    deNumber: (u.de_number as number) || i + 1,
    title: (u.title as string) || "",
    boundary: (u.boundary as string) || "",
    documentType: (u.document_type as string) || "",
    textFunction: (u.text_function as string) || "",
    indicativeAbstract: (u.indicative_abstract as string) || "",
    descriptors: (u.descriptors as string[]) || [],
    freeKeywords: (u.free_keywords as string) || "",
    category: (u.category as string) || "",
    evidenceType: (u.evidence_type as string) || "",
    aiRelevance: (u.ai_relevance as string) || "",
    typicalUserQuestion: (u.typical_user_question as string) || "",
    retrievalFocus: (u.retrieval_focus as string) || "",
    sourceSpans: (u.source_spans as { label?: string; page?: number; paragraph?: number }[]) || [],
  }));

  const quotes = ((parsed.quotes as Record<string, unknown>[]) || []).map(
    (q, i) => ({
      id: `q-${i + 1}`,
      documentationUnitId: (q.documentation_unit_id as string) || undefined,
      text: (q.text as string) || "",
      location: (q.location as string) || "",
      rationale: (q.rationale as string) || "",
    })
  );

  return {
    documentType: (parsed.document_type as string) || "",
    macroStructure: (parsed.macro_structure as string) || "",
    documentationUnits: units,
    quotes,
    macroProfile: (parsed.macro_profile as string) || "",
    motifs: (parsed.motifs as string) || undefined,
    openQuestions: (parsed.open_questions as string) || undefined,
    followUpQuestions: (parsed.follow_up_questions as string[]) || [],
  };
}

export async function answerQuestion(
  question: string,
  analysisJson: string,
  mode: AnswerMode
): Promise<QaAnswer> {
  const client = getClient();
  const prompt = buildQaPrompt(question, analysisJson, mode);

  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    return {
      answer: raw,
      referencedDes: [],
      mode,
    };
  }

  return {
    answer: (parsed.answer as string) || raw,
    referencedDes: (parsed.referenced_des as number[]) || [],
    mode,
  };
}
