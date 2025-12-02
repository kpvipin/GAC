import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { break_id } = await req.json();

  const b = await prisma.sessionBreak.update({
    where: { id: break_id },
    data: {
      end_time: new Date(),
    },
  });

  return Response.json({ success: true, data: b });
}
