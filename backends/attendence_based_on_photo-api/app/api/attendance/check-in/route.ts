import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";
import { getTodaysStartOfDateInTenantTZ, getCurrentDateTimeInTenantTZ } from "@/app/commong/utils";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const loggedInUser = getLoggedInUser(req);

  const session = await prisma.attendance_sessions.create({
    data: {
      users: {
        connect: { id: userId },
      },
      work_date: getTodaysStartOfDateInTenantTZ(),
      check_in_time: getCurrentDateTimeInTenantTZ(),
      tenants: {
        connect: { id: loggedInUser.tenantId },
      },
    },
  });
  return Response.json({ success: true, data: session });
}
