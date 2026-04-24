# Dokumentarischer Literaturassistent

Eine produktionsnahe Web-App zur dokumentarischen Erschließung und fragegestützten Analyse von Texten.

**Kernprinzip:** Zuerst strukturierte dokumentarische Vorerschließung eines Dokuments (Stufe 1), danach fragegestützte Auskunft auf Basis dieser Erschließung (Stufe 2).

## Features

- Upload von PDF, DOCX, TXT (bis 20 MB)
- Direkteingabe von Text
- Automatische Segmentierung in Dokumentationseinheiten (DEs) mit 17 Erschließungsfeldern
- Schlüsselzitate mit DE-Bezug
- Makroprofil, Leitmotive, Anschlussfragen
- Fragebasierter Chat mit 7 Antwortmodi (Kurzantwort, DE-Bezug, Vergleich, Synthese, Belegmodus, Schlagwörter, Dokumentarische Maske)
- Export als JSON, CSV, Markdown
- Persistenz über SQLite (Sitzungen, Dokumente, Analysen, QA-Verlauf)
- Mehrere Sitzungen parallel verwaltbar

## Voraussetzungen

- Node.js >= 18
- Anthropic API Key

## Setup

```bash
# 1. Repository klonen und Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# ANTHROPIC_API_KEY in .env eintragen

# 3. Datenbank initialisieren
npx prisma migrate dev

# 4. Entwicklungsserver starten
npm run dev
```

Die App ist unter http://localhost:3000 erreichbar.

## ENV-Variablen

| Variable | Erforderlich | Beschreibung |
|---|---|---|
| `DATABASE_URL` | Ja | SQLite-Pfad, Standard: `file:./prisma/dev.db` |
| `ANTHROPIC_API_KEY` | Ja | Anthropic API Key |
| `ANTHROPIC_MODEL` | Nein | Modell-ID, Standard: `claude-sonnet-4-6` |

## Befehle

```bash
npm run dev        # Entwicklungsserver
npm run build      # Produktions-Build
npm run start      # Produktionsserver
npm run lint       # ESLint

npx prisma studio  # Datenbankansicht im Browser
npx prisma migrate dev --name <name>  # Neue Migration
```

## Schnelltest mit Beispieldokument

Nach dem Start die Datei `fixtures/beispiel-dokument.txt` hochladen und mit „Jetzt erschließen" eine vollständige DE-Erschließung generieren.

## Architektur

```
Next.js 15 (App Router) + TypeScript
Prisma 7 + SQLite
Anthropic Claude API
Tailwind CSS
```

Detaillierte Architektur: siehe `CLAUDE.md`.
