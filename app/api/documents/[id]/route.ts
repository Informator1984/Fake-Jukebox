import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const doc = await prisma.document.findUnique({
      where: { id },
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
    if (!doc) {
      return NextResponse.json({ error: "Dokument nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.error("GET /api/documents/[id]:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/documents/[id]:", error);
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
}
