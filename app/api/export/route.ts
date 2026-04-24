import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");
  const format = searchParams.get("format") || "json";

  if (!documentId) {
    return NextResponse.json({ error: "documentId fehlt." }, { status: 400 });
  }

  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        analysis: {
          include: {
            documentationUnits: { orderBy: { deNumber: "asc" } },
            quotes: true,
          },
        },
        qaTurns: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!doc || !doc.analysis) {
      return NextResponse.json({ error: "Keine Analyse gefunden." }, { status: 404 });
    }

    const { analysis } = doc;
    const units = analysis.documentationUnits;
    const quotes = analysis.quotes;

    if (format === "json") {
      const payload = {
        document: {
          id: doc.id,
          filename: doc.filename,
          pageCount: doc.pageCount,
          createdAt: doc.createdAt,
        },
        analysis: {
          documentType: analysis.documentType,
          macroStructure: analysis.macroStructure,
          macroProfile: analysis.macroProfile,
          motifs: analysis.motifs,
          openQuestions: analysis.openQuestions,
          followUpQuestions: JSON.parse(analysis.followUpQuestions),
          documentationUnits: units.map((u) => ({
            deNumber: u.deNumber,
            title: u.title,
            boundary: u.boundary,
            documentType: u.documentType,
            textFunction: u.textFunction,
            indicativeAbstract: u.indicativeAbstract,
            descriptors: JSON.parse(u.descriptors),
            freeKeywords: u.freeKeywords,
            category: u.category,
            evidenceType: u.evidenceType,
            aiRelevance: u.aiRelevance,
            typicalUserQuestion: u.typicalUserQuestion,
            retrievalFocus: u.retrievalFocus,
          })),
          quotes: quotes.map((q) => ({
            documentationUnitId: q.documentationUnitId,
            text: q.text,
            location: q.location,
            rationale: q.rationale,
          })),
        },
        qaTurns: doc.qaTurns.map((t) => ({
          question: t.question,
          answer: t.answer,
          mode: t.answerMode,
          createdAt: t.createdAt,
        })),
      };
      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${doc.filename}-analyse.json"`,
        },
      });
    }

    if (format === "csv") {
      const headers = [
        "DE-Nr.",
        "Titelansatz",
        "Seiten/Grenze",
        "Dokumenttyp",
        "Textfunktion",
        "Indikativer Abstract",
        "Deskriptor 1",
        "Deskriptor 2",
        "Deskriptor 3",
        "Deskriptor 4",
        "Deskriptor 5",
        "Freie Stichwörter",
        "Leitkategorie",
        "Evidenztyp",
        "Relevanz KI",
        "Typische Nutzerfrage",
        "Retrieval-Fokus",
      ];
      const escape = (v: string) => `"${String(v || "").replace(/"/g, '""')}"`;
      const rows = units.map((u) => {
        const descs: string[] = JSON.parse(u.descriptors);
        return [
          u.deNumber,
          u.title,
          u.boundary,
          u.documentType,
          u.textFunction,
          u.indicativeAbstract,
          descs[0] || "",
          descs[1] || "",
          descs[2] || "",
          descs[3] || "",
          descs[4] || "",
          u.freeKeywords,
          u.category,
          u.evidenceType,
          u.aiRelevance,
          u.typicalUserQuestion,
          u.retrievalFocus,
        ]
          .map((v) => escape(String(v)))
          .join(",");
      });
      const csv = [headers.map((h) => escape(h)).join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${doc.filename}-de-tabelle.csv"`,
        },
      });
    }

    if (format === "markdown") {
      const lines: string[] = [];
      lines.push(`# Dokumentarische Erschließung: ${doc.filename}\n`);
      lines.push(`**Dokumenttyp:** ${analysis.documentType}  `);
      lines.push(`**Makrostruktur:** ${analysis.macroStructure}\n`);
      lines.push(`## Makroprofil\n\n${analysis.macroProfile}\n`);
      if (analysis.motifs) lines.push(`## Leitmotive & Argumentachsen\n\n${analysis.motifs}\n`);
      if (analysis.openQuestions) lines.push(`## Offene Fragen\n\n${analysis.openQuestions}\n`);
      lines.push(`## Dokumentationseinheiten\n`);
      for (const u of units) {
        const descs: string[] = JSON.parse(u.descriptors);
        lines.push(`### DE ${u.deNumber}: ${u.title}\n`);
        lines.push(`| Feld | Wert |`);
        lines.push(`|------|------|`);
        lines.push(`| Seiten/Grenze | ${u.boundary} |`);
        lines.push(`| Dokumenttyp | ${u.documentType} |`);
        lines.push(`| Textfunktion | ${u.textFunction} |`);
        lines.push(`| Leitkategorie | ${u.category} |`);
        lines.push(`| Evidenztyp | ${u.evidenceType} |`);
        lines.push(`\n**Abstract:** ${u.indicativeAbstract}\n`);
        lines.push(`**Deskriptoren:** ${descs.join(" · ")}\n`);
        lines.push(`**Freie Stichwörter:** ${u.freeKeywords}\n`);
        lines.push(`**Typische Nutzerfrage:** ${u.typicalUserQuestion}\n`);
      }
      if (quotes.length > 0) {
        lines.push(`## Schlüsselzitate\n`);
        for (const q of quotes) {
          lines.push(`> "${q.text}"\n`);
          lines.push(`*(${q.location})* – ${q.rationale}\n`);
        }
      }
      lines.push(`## Anschlussfragen\n`);
      const fqs: string[] = JSON.parse(analysis.followUpQuestions);
      fqs.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
      const md = lines.join("\n");
      return new NextResponse(md, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${doc.filename}-analyse.md"`,
        },
      });
    }

    return NextResponse.json({ error: "Unbekanntes Format." }, { status: 400 });
  } catch (error) {
    console.error("GET /api/export:", error);
    return NextResponse.json({ error: "Exportfehler" }, { status: 500 });
  }
}
