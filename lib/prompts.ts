export const SYSTEM_PROMPT = `Du bist ein dokumentarisch arbeitender Textanalyseassistent mit Schwerpunkt auf inhaltlicher Segmentierung, dokumentarischer Verschlagwortung, textnaher Auskunft und belegorientierter Analyse.

Du arbeitest nicht primär als freier Chatbot, sondern als dokumentationswissenschaftlich orientiertes System.

Deine Grundsätze:
- Analytisch, nüchtern, präzise, textnah, belegorientiert
- Trennscharf statt gefällig
- Unsicherheit markieren statt erfinden
- Keine Inhalte halluzinieren
- Klare Unterscheidung zwischen Analyse, Paraphrase und Direktzitat
- Bei neu hochgeladenen Dokumenten NICHT mit einer freien Gesamtsummary beginnen
- Erst DE-Struktur, dann Makroprofil, dann Fragen

Antworte IMMER auf Deutsch.`;

export function buildAnalysisPrompt(text: string): string {
  const truncated = text.length > 80000 ? text.slice(0, 80000) + "\n\n[Text gekürzt]" : text;

  return `Führe eine vollständige dokumentarische Vorerschließung des folgenden Textes durch.

VERBINDLICHE ZWEISTUFIGKEIT:
STUFE 1: Dokumentarische Vorerschließung (jetzt auszuführen)
STUFE 2: Fragebeantwortung (folgt später bei Nutzerfragen)

STUFE 1 – REGELN:
1. Bestimme kurz den Dokumenttyp.
2. Ermittle die Makrostruktur (Aufbau, Gliederungsprinzip, Hauptteile).
3. Segmentiere in sinnvolle Dokumentationseinheiten (DE) nach inhaltlicher und funktionaler Geschlossenheit – NICHT mechanisch nach Länge.
   Kriterien für neue DEs: Themenwechsel, neue argumentative Funktion, Wechsel Problem/Lösung, Definition/Beispiel/Methode/Ergebnis/Bewertung/Einwand/Fazit, Perspektivwechsel.
4. Mache Grenzunsicherheit sichtbar, wenn mehrere Segmentierungen plausibel sind.
5. Nach der DE-Tabelle: Makroprofil, ggf. Leitmotive/Spannungen/Argumentachsen, ggf. offene Fragen, fünf Anschlussfragen.

ZITATE: Pro DE 0–2 direkte Schlüsselzitate nur wenn: sie eine Hauptthese verdichten, eine Definition/Forderung/Abgrenzung präzise formulieren, eine Kontroverse sichtbar machen, ein zentrales Ergebnis benennen, oder als belastbare Belegstelle nützlich sind.

Antworte AUSSCHLIESSLICH mit gültigem JSON in folgendem Schema (kein Text davor oder danach):

{
  "document_type": "string – Dokumenttyp (z.B. wissenschaftlicher Aufsatz, Gutachten, Bericht...)",
  "macro_structure": "string – Aufbau und Gliederungsprinzip",
  "documentation_units": [
    {
      "id": "de-1",
      "de_number": 1,
      "title": "string – Titelansatz/Benennung",
      "boundary": "string – Seiten/Formale Grenze (z.B. 'S. 1–3', 'Abs. 1–4', 'Einleitung')",
      "document_type": "string – Dokumenttyp dieser DE",
      "text_function": "string – Textfunktion im Gesamtdokument",
      "indicative_abstract": "string – Indikativer Abstract (3–5 Sätze)",
      "descriptors": ["string", "string", "string", "string", "string"],
      "free_keywords": "string – kommagetrennte Stichwörter",
      "category": "string – Leitkategorie/Facette",
      "evidence_type": "string – Evidenztyp (empirisch/theoretisch/normativ/deskriptiv...)",
      "ai_relevance": "string – Relevanz für KI-Auswertung",
      "typical_user_question": "string – Typische Nutzerfrage",
      "retrieval_focus": "string – Retrieval-Fokus",
      "source_spans": [
        {"label": "string", "page": null, "paragraph": null}
      ]
    }
  ],
  "quotes": [
    {
      "documentation_unit_id": "de-1",
      "text": "string – wörtliches Zitat",
      "location": "string – Fundstelle (z.B. 'S. 2, Abs. 3')",
      "rationale": "string – warum dokumentarisch relevant"
    }
  ],
  "macro_profile": "string – Makroprofil des Gesamtdokuments (Thema, Zweck, Kontext, Qualität der Erschließung)",
  "motifs": "string oder null – Leitmotive, Spannungen, Argumentachsen (wenn sinnvoll)",
  "open_questions": "string oder null – offene Fragen oder Unschärfen der Erschließung (wenn vorhanden)",
  "follow_up_questions": ["string", "string", "string", "string", "string"]
}

DOKUMENT:
---
${truncated}
---`;
}

export function buildQaPrompt(
  question: string,
  analysisJson: string,
  mode: string
): string {
  const modeInstructions: Record<string, string> = {
    short: "Antworte knapp und präzise in 2–4 Sätzen.",
    with_de_reference:
      "Nenne explizit die relevanten DE-Nummern und beziehe dich textgenau auf deren Inhalt.",
    compare_des:
      "Vergleiche explizit mehrere DEs und arbeite Gemeinsamkeiten, Unterschiede und Spannungen heraus.",
    thematic_synthesis:
      "Synthetisiere themenübergreifend über mehrere DEs hinweg zu einer kohärenten Antwort.",
    evidence_mode:
      "Belege jede Aussage mit direkten Zitaten aus dem Text. Markiere Zitate explizit.",
    keywords:
      "Antworte als strukturierte Schlagwortliste mit kurzen Erläuterungen.",
    documentary_mask:
      "Erstelle eine dokumentarische Kurzmaske: Titelansatz, Abstract (2–3 Sätze), 3–5 Deskriptoren, Evidenztyp.",
  };

  const instruction = modeInstructions[mode] || modeInstructions.short;

  return `Du hast ein Dokument bereits dokumentarisch erschlossen. Die Erschließung liegt als JSON vor.

AUFGABE: Beantworte die Nutzerfrage auf Basis der dokumentarischen Erschließung.

REGELN FÜR STUFE 2:
1. Bestimme zuerst, welche DEs für die Frage relevant sind (nenne DE-Nummern).
2. Antworte textnah und unterscheide klar zwischen:
   - "Im Text explizit: ..."
   - "Indirekt ableitbar: ..."
   - "Im Text nicht belegt: ..."
3. Direktzitate nur als Beleg, nicht als loses Sammelmaterial.
4. ${instruction}

Antworte AUSSCHLIESSLICH mit gültigem JSON:
{
  "referenced_des": [1, 2],
  "answer": "string – vollständige Antwort",
  "mode": "${mode}"
}

ERSCHLIESSUNG:
${analysisJson}

NUTZERFRAGE: ${question}`;
}
