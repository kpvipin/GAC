import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = JSON.parse(req.headers.get("x-user")!);

  const sessions = await prisma.attendance_sessions.findMany({
    where: { tenant_id: auth.tenantId },
    include: {
      breaks: true,
      employee: true,
    },
  });

  return Response.json({ success: true, data: sessions });
}
