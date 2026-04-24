import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function Home() {
  // Find or create a default session and redirect to workspace
  let session = await prisma.session.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!session) {
    session = await prisma.session.create({ data: { name: "Sitzung 1" } });
  }
  redirect(`/workspace/${session.id}`);
}
