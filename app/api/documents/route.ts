import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractText } from "@/lib/extract";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei übergeben." }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId fehlt." }, { status: 400 });
    }

    const ALLOWED = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "text/markdown",
    ];

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Dateityp nicht unterstützt: ${file.type}` },
        { status: 422 }
      );
    }

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Datei zu groß (max. 20 MB)." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extracted;
    try {
      extracted = await extractText(buffer, file.type);
    } catch (e) {
      return NextResponse.json(
        { error: `Textextraktion fehlgeschlagen: ${(e as Error).message}` },
        { status: 422 }
      );
    }

    if (!extracted.text.trim()) {
      return NextResponse.json(
        { error: "Kein lesbarer Text im Dokument gefunden." },
        { status: 422 }
      );
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: "Sitzung nicht gefunden." }, { status: 404 });
    }

    const doc = await prisma.document.create({
      data: {
        sessionId,
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
        textContent: extracted.text,
        pageCount: extracted.pageCount ?? null,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents:", error);
    return NextResponse.json({ error: "Serverfehler beim Upload." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  try {
    const where = sessionId ? { sessionId } : {};
    const docs = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { analysis: { select: { id: true } } },
    });
    return NextResponse.json(docs);
  } catch (error) {
    console.error("GET /api/documents:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
