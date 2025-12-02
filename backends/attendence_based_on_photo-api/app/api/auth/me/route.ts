import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = JSON.parse(req.headers.get("x-user")!);

  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  return Response.json({ success: true, data: profile });
}
