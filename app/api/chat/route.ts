import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { answerQuestion } from "@/lib/llm";
import { AnswerMode } from "@/types/analysis";

export async function POST(req: Request) {
  try {
    const { documentId, question, mode } = await req.json();

    if (!documentId || !question) {
      return NextResponse.json({ error: "documentId und question erforderlich." }, { status: 400 });
    }

    const answerMode: AnswerMode = (mode as AnswerMode) || "with_de_reference";

    const analysis = await prisma.analysis.findUnique({
      where: { documentId },
      include: {
        documentationUnits: { orderBy: { deNumber: "asc" } },
        quotes: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Keine Analyse vorhanden. Bitte zuerst Dokument analysieren." },
        { status: 409 }
      );
    }

    const result = await answerQuestion(question, analysis.rawJson, answerMode);

    const turn = await prisma.qaTurn.create({
      data: {
        documentId,
        question,
        answer: result.answer,
        answerMode: result.mode,
        referencedDes: JSON.stringify(result.referencedDes),
      },
    });

    return NextResponse.json({ ...turn, referencedDes: result.referencedDes });
  } catch (error) {
    console.error("POST /api/chat:", error);
    const msg = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: `Frage konnte nicht beantwortet werden: ${msg}` }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json({ error: "documentId fehlt." }, { status: 400 });
  }

  try {
    const turns = await prisma.qaTurn.findMany({
      where: { documentId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(turns);
  } catch (error) {
    console.error("GET /api/chat:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
