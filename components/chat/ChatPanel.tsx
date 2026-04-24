"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { AnswerMode } from "@/types/analysis";

interface Turn {
  id: string;
  question: string;
  answer: string;
  answerMode: string;
  referencedDes: number[];
  createdAt: string;
}

interface ChatPanelProps {
  documentId: string;
  initialTurns?: {
    id: string;
    question: string;
    answer: string;
    answerMode: string;
    referencedDes: string;
    createdAt: Date | string;
  }[];
  pendingQuestion?: string;
  onPendingConsumed?: () => void;
}

const MODE_LABELS: Record<string, string> = {
  short: "Kurzantwort",
  with_de_reference: "DE-Bezug",
  compare_des: "DE-Vergleich",
  thematic_synthesis: "Synthese",
  evidence_mode: "Belegmodus",
  keywords: "Schlagwörter",
  documentary_mask: "Dok.-Maske",
};

export default function ChatPanel({ documentId, initialTurns = [], pendingQuestion, onPendingConsumed }: ChatPanelProps) {
  const [turns, setTurns] = useState<Turn[]>(
    initialTurns.map((t) => ({
      ...t,
      createdAt: typeof t.createdAt === "string" ? t.createdAt : t.createdAt.toISOString(),
      referencedDes: (() => { try { return JSON.parse(t.referencedDes); } catch { return []; } })(),
    }))
  );
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<AnswerMode>("with_de_reference");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  // When a pending question arrives from outside, pre-fill the input
  const effectiveQuestion = pendingQuestion !== undefined && question === "" ? pendingQuestion : question;

  async function ask(overrideQ?: string) {
    const q = (overrideQ ?? effectiveQuestion).trim();
    if (!q || loading) return;
    setLoading(true);
    setQuestion("");
    if (pendingQuestion) onPendingConsumed?.();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, question: q, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler");
      setTurns((prev) => [
        ...prev,
        {
          id: data.id,
          question: q,
          answer: data.answer,
          answerMode: data.answerMode,
          referencedDes: Array.isArray(data.referencedDes) ? data.referencedDes : [],
          createdAt: data.createdAt,
        },
      ]);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {turns.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center pt-8">
            Noch keine Fragen gestellt. Stellen Sie eine Frage zum Dokument.
          </p>
        )}
        {turns.map((t) => (
          <div key={t.id} className="space-y-3">
            <div className="flex justify-end">
              <div className="max-w-prose bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm">
                {t.question}
              </div>
            </div>
            <div className="space-y-2">
              <div className="max-w-prose bg-slate-50 border rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="blue">{MODE_LABELS[t.answerMode] || t.answerMode}</Badge>
                  {t.referencedDes.length > 0 && (
                    <span className="text-xs text-slate-400">
                      DE {t.referencedDes.join(", ")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{t.answer}</p>
                <button
                  className="mt-2 text-xs text-slate-400 hover:text-slate-600"
                  onClick={() => {
                    navigator.clipboard.writeText(t.answer);
                    toast("Antwort kopiert", "success");
                  }}
                >
                  Kopieren
                </button>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="animate-pulse">●</span>
            <span>Analyse läuft…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">Antwortmodus:</span>
          {(Object.keys(MODE_LABELS) as AnswerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                mode === m ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            className="flex-1 text-sm border rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
            rows={2}
            placeholder="Frage zum Dokument eingeben…"
            value={effectiveQuestion}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
            disabled={loading}
          />
          <Button onClick={() => ask()} disabled={loading || !effectiveQuestion.trim()} className="self-end">
            Senden
          </Button>
        </div>
      </div>
    </div>
  );
}
