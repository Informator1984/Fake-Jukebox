# Dokumentarischer Literaturassistent — CLAUDE.md

## Projektzweck

Produktionsnahe Web-App zur dokumentarischen Erschließung und fragegestützten Analyse von Texten. Kernprinzip: **Erst strukturierte dokumentarische Vorerschließung, dann fragebasierte Auskunft.**

## Architektur

```
app/                    Next.js App Router
  api/
    sessions/           CRUD für Sitzungen
    documents/          Upload + CRUD für Dokumente
    analyze/            LLM-Analysepipeline (Stufe 1)
    chat/               LLM-Frage-Antwort (Stufe 2)
    export/             JSON/CSV/Markdown-Export
  workspace/[sessionId]/
    page.tsx            Server Component (Datenladen)
    WorkspaceClient.tsx Client Component (UI-State)
  layout.tsx
  globals.css

components/
  ui/                   Button, Badge, Toast
  upload/               UploadArea
  analysis/             AnalysisPanel, DeTable, QuoteList, MacroProfile, ExportBar
  chat/                 ChatPanel

lib/
  db.ts                 Prisma-Client-Singleton
  extract.ts            PDF/DOCX/TXT-Textextraktion
  llm.ts                Anthropic-API-Integration
  prompts.ts            Systemprompt, Analyse-Prompt, QA-Prompt

types/
  analysis.ts           Typen für AnalysisResult, DocumentationUnit, Quote, QaAnswer

prisma/
  schema.prisma         Datenbankschema (SQLite)
  migrations/           Prisma-Migrationen

fixtures/
  beispiel-dokument.txt Testdokument für schnellen Lokal-Test
```

## Datenmodell

- **Session** → hat viele **Documents**
- **Document** → hat eine **Analysis** + viele **QaTurns**
- **Analysis** → hat viele **DocumentationUnits** + **Quotes**
- **DocumentationUnit** → DE mit allen dokumentarischen Feldern
- **Quote** → Schlüsselzitat, optional einer DE zugeordnet
- **QaTurn** → Frage-Antwort-Paar mit Antwortmodus und referenzierten DEs

## LLM-Architektur

**Stufe 1 (Analyse):** `POST /api/analyze` → `lib/llm.ts::analyzeDocument` → Anthropic API
- Systemprompt: dokumentarisch, analytisch, nüchtern
- Ausgabe: strukturiertes JSON mit document_type, macro_structure, documentation_units[], quotes[], macro_profile, follow_up_questions[]

**Stufe 2 (QA):** `POST /api/chat` → `lib/llm.ts::answerQuestion` → Anthropic API
- Prompt enthält die vollständige Erschließung als JSON-Kontext
- Antwortmodus steuert Detailtiefe und Darstellungsform
- Antwort enthält referenced_des[] für UI-Verlinkung

## Qualitätsregeln

- Keine freie Zusammenfassung bei neuem Dokument — erst Erschließung
- Alle Aussagen müssen zwischen "explizit", "indirekt ableitbar" und "nicht belegt" unterscheiden
- Direktzitate nur als Belege, nicht als Sammelmaterial
- Unsicherheit in der Segmentierung wird sichtbar gemacht
- Anzahl der DEs folgt der Textkomplexität (nicht mechanisch)

## Entwicklungsregeln

- Keine unnötigen Abhängigkeiten
- Serverseitige Logik in `lib/` und `app/api/`
- Client Components nur wo nötig (`"use client"`)
- Alle DB-Operationen über Prisma
- JSON-Felder (descriptors, followUpQuestions, sourceSpans) als serialisierter String (SQLite-Kompatibilität)
- ENV-Variablen: `ANTHROPIC_API_KEY`, `DATABASE_URL`, optional `ANTHROPIC_MODEL`
