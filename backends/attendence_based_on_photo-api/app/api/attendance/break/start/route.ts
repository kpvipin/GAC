import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { session_id } = await req.json();

  const b = await prisma.sessionBreak.create({
    data: {
      session_id,
      start_time: new Date(),
    },
  });

  return Response.json({ success: true, data: b });
}
