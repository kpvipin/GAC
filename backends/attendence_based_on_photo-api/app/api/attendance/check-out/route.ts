import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";
import { getCurrentDateTimeInTenantTZ } from "@/app/commong/utils";

export async function POST(req: Request) {
  const { sessionId } = await req.json();
  console.log("Checkout sessionId", sessionId);
  const loggedInUser = getLoggedInUser(req);
  const session = await prisma.attendance_sessions.update({
    where: { id: sessionId },
    data: { check_out_time: getCurrentDateTimeInTenantTZ(), updated_at: getCurrentDateTimeInTenantTZ() },
  });
  return Response.json({ success: true, data: session });
}
