interface MacroProfileProps {
  documentType: string;
  macroStructure: string;
  macroProfile: string;
  motifs?: string | null;
  openQuestions?: string | null;
  followUpQuestions: string;
  onAskQuestion?: (question: string) => void;
}

function parseArray(s: string): string[] {
  try { return JSON.parse(s); } catch { return [s]; }
}

export default function MacroProfile({
  documentType,
  macroStructure,
  macroProfile,
  motifs,
  openQuestions,
  followUpQuestions,
  onAskQuestion,
}: MacroProfileProps) {
  const fqs = parseArray(followUpQuestions);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Dokumenttyp</p>
          <p className="text-sm text-slate-800">{documentType}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Makrostruktur</p>
          <p className="text-sm text-slate-800">{macroStructure}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Makroprofil</p>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{macroProfile}</p>
      </div>

      {motifs && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Leitmotive & Argumentachsen</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{motifs}</p>
        </div>
      )}

      {openQuestions && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2">Offene Fragen / Unschärfen</p>
          <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">{openQuestions}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Anschlussfragen</p>
        <div className="space-y-2">
          {fqs.map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 text-slate-400 text-sm">{i + 1}.</span>
              {onAskQuestion ? (
                <button
                  onClick={() => onAskQuestion(q)}
                  className="text-sm text-slate-700 text-left hover:text-slate-900 hover:underline"
                >
                  {q}
                </button>
              ) : (
                <p className="text-sm text-slate-700">{q}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
