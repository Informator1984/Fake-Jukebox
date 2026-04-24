import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import WorkspaceClient from "./WorkspaceClient";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
        select: { id: true, filename: true, mimeType: true, fileSize: true, pageCount: true, createdAt: true },
      },
    },
  });

  if (!session) notFound();

  const allSessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });

  return <WorkspaceClient session={session} allSessions={allSessions} />;
}
