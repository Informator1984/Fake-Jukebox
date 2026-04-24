"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatFileSize } from "@/lib/utils";

interface UploadAreaProps {
  sessionId: string;
  onUploaded: (documentId: string) => void;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];
const ACCEPTED_EXT = ".pdf,.docx,.txt,.md";

export default function UploadArea({ sessionId, onUploaded }: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [textInput, setTextInput] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function upload(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx|txt|md)$/i)) {
      toast(`Dateityp nicht unterstützt: ${file.name}`, "error");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("sessionId", sessionId);
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
      toast(`„${file.name}" hochgeladen (${formatFileSize(file.size)})`, "success");
      onUploaded(data.id);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setUploading(false);
    }
  }

  async function uploadText() {
    if (!pastedText.trim()) {
      toast("Kein Text eingegeben.", "error");
      return;
    }
    const blob = new Blob([pastedText], { type: "text/plain" });
    const file = new File([blob], "eingefügter-text.txt", { type: "text/plain" });
    await upload(file);
    setPastedText("");
    setTextInput(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(upload);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(upload);
    e.target.value = "";
  }

  if (textInput) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Text direkt einfügen</span>
          <button onClick={() => setTextInput(false)} className="text-xs text-slate-400 hover:text-slate-600">
            Abbrechen
          </button>
        </div>
        <textarea
          className="w-full h-48 text-sm border rounded p-2 resize-y focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder="Text hier einfügen…"
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
        />
        <Button onClick={uploadText} disabled={uploading || !pastedText.trim()}>
          {uploading ? "Wird hochgeladen…" : "Text übernehmen"}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragging ? "border-slate-500 bg-slate-50" : "border-slate-200 hover:border-slate-300"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={fileRef} type="file" accept={ACCEPTED_EXT} multiple className="hidden" onChange={onChange} />
      <div className="space-y-3">
        <div className="text-4xl">📄</div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            Datei hierher ziehen oder
          </p>
          <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, TXT, MD · max. 20 MB</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} variant="secondary" size="sm">
            {uploading ? "Wird hochgeladen…" : "Datei auswählen"}
          </Button>
          <Button onClick={() => setTextInput(true)} variant="ghost" size="sm">
            Text einfügen
          </Button>
        </div>
      </div>
    </div>
  );
}
