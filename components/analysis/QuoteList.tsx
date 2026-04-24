"use client";

import { useToast } from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";

interface Quote {
  id: string;
  documentationUnitId?: string | null;
  text: string;
  location: string;
  rationale: string;
}

interface QuoteListProps {
  quotes: Quote[];
  units: { id: string; deNumber: number; title: string }[];
}

export default function QuoteList({ quotes, units }: QuoteListProps) {
  const { toast } = useToast();

  const unitMap = new Map(units.map((u) => [u.id, u]));

  if (quotes.length === 0) {
    return <p className="text-sm text-slate-400 italic">Keine Schlüsselzitate erschlossen.</p>;
  }

  return (
    <div className="space-y-4">
      {quotes.map((q) => {
        const unit = q.documentationUnitId ? unitMap.get(q.documentationUnitId) : null;
        return (
          <div key={q.id} className="border-l-4 border-slate-300 pl-4 space-y-1.5">
            <button
              className="text-sm font-medium text-slate-800 text-left italic leading-relaxed hover:text-slate-600"
              onClick={() => {
                navigator.clipboard.writeText(q.text);
                toast("Zitat kopiert", "success");
              }}
              title="Klicken zum Kopieren"
            >
              &bdquo;{q.text}&ldquo;
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">{q.location}</span>
              {unit && (
                <Badge variant="blue">DE {unit.deNumber}</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">{q.rationale}</p>
          </div>
        );
      })}
    </div>
  );
}
