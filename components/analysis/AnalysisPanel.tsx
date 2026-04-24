"use client";

import { useState } from "react";
import DeTable from "./DeTable";
import QuoteList from "./QuoteList";
import MacroProfile from "./MacroProfile";

interface AnalysisPanelProps {
  analysis: {
    id: string;
    documentType: string;
    macroStructure: string;
    macroProfile: string;
    motifs?: string | null;
    openQuestions?: string | null;
    followUpQuestions: string;
    documentationUnits: {
      id: string;
      deNumber: number;
      title: string;
      boundary: string;
      documentType: string;
      textFunction: string;
      indicativeAbstract: string;
      descriptors: string;
      freeKeywords: string;
      category: string;
      evidenceType: string;
      aiRelevance: string;
      typicalUserQuestion: string;
      retrievalFocus: string;
    }[];
    quotes: {
      id: string;
      documentationUnitId?: string | null;
      text: string;
      location: string;
      rationale: string;
    }[];
  };
  documentId: string;
  onAskQuestion?: (q: string) => void;
}

const TABS = [
  { id: "profile", label: "Makroprofil" },
  { id: "units", label: "DE-Tabelle" },
  { id: "quotes", label: "Schlüsselzitate" },
];

export default function AnalysisPanel({ analysis, documentId, onAskQuestion }: AnalysisPanelProps) {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
            {t.id === "units" && (
              <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 rounded px-1">
                {analysis.documentationUnits.length}
              </span>
            )}
            {t.id === "quotes" && analysis.quotes.length > 0 && (
              <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 rounded px-1">
                {analysis.quotes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div>
        {tab === "profile" && (
          <MacroProfile
            documentType={analysis.documentType}
            macroStructure={analysis.macroStructure}
            macroProfile={analysis.macroProfile}
            motifs={analysis.motifs}
            openQuestions={analysis.openQuestions}
            followUpQuestions={analysis.followUpQuestions}
            onAskQuestion={onAskQuestion}
          />
        )}
        {tab === "units" && (
          <DeTable units={analysis.documentationUnits} documentId={documentId} />
        )}
        {tab === "quotes" && (
          <QuoteList
            quotes={analysis.quotes}
            units={analysis.documentationUnits.map((u) => ({ id: u.id, deNumber: u.deNumber, title: u.title }))}
          />
        )}
      </div>
    </div>
  );
}
