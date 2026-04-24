import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        documents: {
          select: {
            id: true,
            filename: true,
            createdAt: true,
            analysis: { select: { id: true } },
          },
        },
      },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("GET /api/sessions:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const session = await prisma.session.create({
      data: { name: name || "Neue Sitzung" },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
