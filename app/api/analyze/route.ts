import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeDocument } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId fehlt." }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { analysis: { select: { id: true } } },
    });
    if (!doc) {
      return NextResponse.json({ error: "Dokument nicht gefunden." }, { status: 404 });
    }

    if (doc.analysis) {
      const existing = await prisma.analysis.findUnique({
        where: { documentId },
        include: {
          documentationUnits: { orderBy: { deNumber: "asc" } },
          quotes: true,
        },
      });
      return NextResponse.json(existing);
    }

    const result = await analyzeDocument(doc.textContent);

    const analysis = await prisma.analysis.create({
      data: {
        documentId,
        documentType: result.documentType,
        macroStructure: result.macroStructure,
        macroProfile: result.macroProfile,
        motifs: result.motifs ?? null,
        openQuestions: result.openQuestions ?? null,
        followUpQuestions: JSON.stringify(result.followUpQuestions),
        rawJson: JSON.stringify(result),
        documentationUnits: {
          create: result.documentationUnits.map((u) => ({
            deNumber: u.deNumber,
            title: u.title,
            boundary: u.boundary,
            documentType: u.documentType,
            textFunction: u.textFunction,
            indicativeAbstract: u.indicativeAbstract,
            descriptors: JSON.stringify(u.descriptors),
            freeKeywords: u.freeKeywords,
            category: u.category,
            evidenceType: u.evidenceType,
            aiRelevance: u.aiRelevance,
            typicalUserQuestion: u.typicalUserQuestion,
            retrievalFocus: u.retrievalFocus,
            sourceSpans: JSON.stringify(u.sourceSpans),
          })),
        },
        quotes: {
          create: result.quotes.map((q) => ({
            text: q.text,
            location: q.location,
            rationale: q.rationale,
            documentationUnitId: undefined,
          })),
        },
      },
      include: {
        documentationUnits: { orderBy: { deNumber: "asc" } },
        quotes: true,
      },
    });

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error("POST /api/analyze:", error);
    const msg = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: `Analyse fehlgeschlagen: ${msg}` }, { status: 500 });
  }
}
