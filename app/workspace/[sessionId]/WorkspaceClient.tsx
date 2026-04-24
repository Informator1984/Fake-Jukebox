"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import UploadArea from "@/components/upload/UploadArea";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import ChatPanel from "@/components/chat/ChatPanel";
import ExportBar from "@/components/analysis/ExportBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatFileSize } from "@/lib/utils";

interface DocStub {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  pageCount?: number | null;
  createdAt: Date | string;
}

interface Session {
  id: string;
  name: string;
  createdAt: Date | string;
  documents: DocStub[];
}

interface SessionStub {
  id: string;
  name: string;
  createdAt: Date | string;
}

interface Props {
  session: Session;
  allSessions: SessionStub[];
}

interface LoadedDoc {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  pageCount?: number | null;
  textContent: string;
  createdAt: string;
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
  } | null;
  qaTurns: {
    id: string;
    question: string;
    answer: string;
    answerMode: string;
    referencedDes: string;
    createdAt: string;
  }[];
}

type WorkspaceView = "document" | "analysis" | "chat";

export default function WorkspaceClient({ session, allSessions }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [docs, setDocs] = useState<DocStub[]>(session.documents);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    session.documents[0]?.id ?? null
  );
  const [loadedDoc, setLoadedDoc] = useState<LoadedDoc | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [view, setView] = useState<WorkspaceView>("document");
  const [pendingQ, setPendingQ] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadDoc = useCallback(async (id: string) => {
    setLoadingDoc(true);
    setLoadedDoc(null);
    try {
      const res = await fetch(`/api/documents/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLoadedDoc(data);
      setSelectedDocId(id);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoadingDoc(false);
    }
  }, [toast]);

  async function handleUploaded(docId: string) {
    const res = await fetch(`/api/documents/${docId}`);
    const data: LoadedDoc = await res.json();
    setDocs((prev) => [data, ...prev]);
    setLoadedDoc(data);
    setSelectedDocId(docId);
    setView("document");
    toast("Dokument bereit. Starten Sie die Analyse.", "success");
  }

  async function startAnalysis() {
    if (!selectedDocId) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: selectedDocId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLoadedDoc((prev) => prev ? { ...prev, analysis: data } : prev);
      setView("analysis");
      toast("Analyse abgeschlossen", "success");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setAnalyzing(false);
    }
  }

  async function createSession() {
    const name = `Sitzung ${allSessions.length + 1}`;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/workspace/${data.id}`);
  }

  function handleAskQuestion(q: string) {
    setPendingQ(q);
    setView("chat");
  }

  const mimeLabel = (mime: string) => {
    if (mime.includes("pdf")) return "PDF";
    if (mime.includes("wordprocessing")) return "DOCX";
    if (mime.includes("msword")) return "DOC";
    return "TXT";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} shrink-0 border-r flex flex-col transition-all duration-200`}>
        <div className="p-4 border-b flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sitzungen</span>
          <Button size="sm" variant="ghost" onClick={createSession}>+</Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {allSessions.map((s) => (
            <a
              key={s.id}
              href={`/workspace/${s.id}`}
              className={`block px-4 py-2 text-sm transition-colors ${
                s.id === session.id
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s.name}
            </a>
          ))}
        </nav>
        <div className="p-3 border-t">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Dokumente</p>
          {docs.length === 0 && (
            <p className="text-xs text-slate-400 italic">Noch keine Dokumente</p>
          )}
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelectedDocId(d.id); loadDoc(d.id); }}
              className={`w-full text-left px-2 py-1.5 rounded text-xs mb-1 transition-colors ${
                d.id === selectedDocId
                  ? "bg-slate-800 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Badge variant={d.id === selectedDocId ? "default" : "default"}>{mimeLabel(d.mimeType)}</Badge>
                <span className="truncate">{d.filename}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-12 border-b flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-slate-400 hover:text-slate-600 text-sm"
            title="Seitenleiste ein/ausblenden"
          >
            ☰
          </button>
          <h1 className="text-sm font-semibold text-slate-700 truncate">
            {loadedDoc?.filename ?? "Dokumentarischer Literaturassistent"}
          </h1>
          {loadedDoc && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Badge>{mimeLabel(loadedDoc.mimeType)}</Badge>
              <span>{formatFileSize(loadedDoc.fileSize)}</span>
              {loadedDoc.pageCount && <span>· {loadedDoc.pageCount} S.</span>}
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {loadedDoc && <ExportBar documentId={loadedDoc.id} />}
          </div>
        </header>

        {/* View tabs */}
        {loadedDoc && (
          <div className="flex border-b px-4 shrink-0">
            {(["document", "analysis", "chat"] as WorkspaceView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  view === v
                    ? "border-slate-800 text-slate-800"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {v === "document" ? "Dokument" : v === "analysis" ? "Analyse" : "Fragemodus"}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedDocId && (
            <div className="max-w-xl mx-auto mt-12 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">Dokument hochladen</h2>
                <p className="text-sm text-slate-500">Laden Sie ein PDF, DOCX oder TXT-Dokument hoch, um die dokumentarische Erschließung zu starten.</p>
              </div>
              <UploadArea sessionId={session.id} onUploaded={handleUploaded} />
            </div>
          )}

          {selectedDocId && !loadedDoc && !loadingDoc && (
            <div className="max-w-xl mx-auto mt-12 space-y-4">
              <UploadArea sessionId={session.id} onUploaded={handleUploaded} />
            </div>
          )}

          {loadingDoc && (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              <span className="animate-pulse">Dokument wird geladen…</span>
            </div>
          )}

          {loadedDoc && view === "document" && (
            <div className="max-w-3xl mx-auto space-y-6">
              {!loadedDoc.analysis && (
                <div className="bg-slate-50 border rounded-lg p-4 flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Dokumentarische Erschließung starten</p>
                    <p className="text-xs text-slate-500 mt-0.5">Stufe 1: Segmentierung in Dokumentationseinheiten (DEs), Verschlagwortung, Makroprofil, Anschlussfragen.</p>
                  </div>
                  <Button onClick={startAnalysis} disabled={analyzing}>
                    {analyzing ? "Analyse läuft…" : "Jetzt erschließen"}
                  </Button>
                </div>
              )}
              {loadedDoc.analysis && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-emerald-700 text-sm">✓ Erschließung vorhanden</span>
                  <Button size="sm" variant="ghost" onClick={() => setView("analysis")}>Zur Analyse →</Button>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Volltext</p>
                <div className="bg-white border rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-xs max-h-[60vh] overflow-y-auto">
                  {loadedDoc.textContent}
                </div>
              </div>
              <UploadArea sessionId={session.id} onUploaded={handleUploaded} />
            </div>
          )}

          {loadedDoc && view === "analysis" && (
            <div className="max-w-3xl mx-auto">
              {!loadedDoc.analysis ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <p className="text-slate-500 text-sm">Noch keine Erschließung vorhanden.</p>
                  <Button onClick={startAnalysis} disabled={analyzing}>
                    {analyzing ? "Analyse läuft…" : "Jetzt erschließen"}
                  </Button>
                </div>
              ) : (
                <AnalysisPanel
                  analysis={loadedDoc.analysis}
                  documentId={loadedDoc.id}
                  onAskQuestion={handleAskQuestion}
                />
              )}
            </div>
          )}

          {loadedDoc && view === "chat" && (
            <div className="max-w-3xl mx-auto h-full" style={{ height: "calc(100vh - 160px)" }}>
              {!loadedDoc.analysis ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <p className="text-slate-500 text-sm">Bitte erst das Dokument erschließen.</p>
                  <Button onClick={startAnalysis} disabled={analyzing}>
                    {analyzing ? "Analyse läuft…" : "Jetzt erschließen"}
                  </Button>
                </div>
              ) : (
                <ChatPanel
                  documentId={loadedDoc.id}
                  initialTurns={loadedDoc.qaTurns}
                  pendingQuestion={pendingQ}
                  onPendingConsumed={() => setPendingQ(undefined)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
