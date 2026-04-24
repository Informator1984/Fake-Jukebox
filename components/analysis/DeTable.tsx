"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface De {
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
}

interface DeTableProps {
  units: De[];
  documentId: string;
}

function parseDescriptors(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return [raw]; }
}

export default function DeTable({ units, documentId }: DeTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function copyTable() {
    const header = "DE-Nr.\tTitelansatz\tGrenze\tDokumenttyp\tTextfunktion\tAbstract\tDeskriptoren\tStichwörter\tKategorie\tEvidenztyp";
    const rows = units.map((u) =>
      [u.deNumber, u.title, u.boundary, u.documentType, u.textFunction, u.indicativeAbstract, parseDescriptors(u.descriptors).join("; "), u.freeKeywords, u.category, u.evidenceType].join("\t")
    );
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    toast("Tabelle in Zwischenablage kopiert", "success");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{units.length} Dokumentationseinheit{units.length !== 1 ? "en" : ""}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={copyTable}>Tabelle kopieren</Button>
          <a href={`/api/export?documentId=${documentId}&format=csv`} download>
            <Button size="sm" variant="secondary">CSV</Button>
          </a>
        </div>
      </div>
      {units.map((u) => {
        const descs = parseDescriptors(u.descriptors);
        const isOpen = expanded.has(u.id);
        return (
          <div key={u.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(u.id)}
              className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="shrink-0 w-7 h-7 rounded bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {u.deNumber}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{u.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{u.boundary} · {u.textFunction}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Badge>{u.evidenceType}</Badge>
              </div>
              <span className="text-slate-400 text-xs shrink-0">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="border-t bg-slate-50 p-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div><span className="text-slate-500">Dokumenttyp:</span> <span className="text-slate-800">{u.documentType}</span></div>
                  <div><span className="text-slate-500">Textfunktion:</span> <span className="text-slate-800">{u.textFunction}</span></div>
                  <div><span className="text-slate-500">Kategorie:</span> <span className="text-slate-800">{u.category}</span></div>
                  <div><span className="text-slate-500">Evidenztyp:</span> <span className="text-slate-800">{u.evidenceType}</span></div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Indikativer Abstract</p>
                  <p className="text-slate-700 leading-relaxed">{u.indicativeAbstract}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Deskriptoren</p>
                  <div className="flex flex-wrap gap-1.5">
                    {descs.map((d, i) => <Badge key={i} variant="blue">{d}</Badge>)}
                  </div>
                </div>

                {u.freeKeywords && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Freie Stichwörter</p>
                    <p className="text-slate-600 text-xs">{u.freeKeywords}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-y-2 text-xs border-t pt-3">
                  <div><span className="text-slate-500">Typische Nutzerfrage:</span> <span className="text-slate-700 italic">{u.typicalUserQuestion}</span></div>
                  <div><span className="text-slate-500">Retrieval-Fokus:</span> <span className="text-slate-700">{u.retrievalFocus}</span></div>
                  <div><span className="text-slate-500">Relevanz für KI-Auswertung:</span> <span className="text-slate-700">{u.aiRelevance}</span></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
