import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";
import { getTodaysStartOfDateInTenantTZ } from "@/app/common/utils";

export async function GET(req: Request) {
  console.log("Inside employees get")
  try {
    const loggedInUser = getLoggedInUser(req);
    const todayDateStr = getTodaysStartOfDateInTenantTZ(loggedInUser.tenantId);
    const employees = await prisma.users.findMany({
      where: { tenant_id: loggedInUser.tenantId, is_employee: true, is_active: true },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        joining_date: true,
        manager_id: true,
        attendance_sessions: {
          where: { work_date: new Date(todayDateStr) },
          select: {
            id: true,
            work_date: true,
            check_in_time: true,
            check_out_time: true,
            total_work_seconds: true,
          },
        },
      },
    });
    return new Response(JSON.stringify({ success: true, data: employees }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Failed to fetch employees" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const loggedInUser = getLoggedInUser(req);
  if (!loggedInUser) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const body = await req.json();
  const { fullName, email, phone, role, joiningDate, managerId } = body;
  if (!fullName) {
    return new Response(JSON.stringify({ error: "fullName is required" }), { status: 400 });
  }
  try {
    const newEmployee = await prisma.users.create({
      data: {
        tenant_id: loggedInUser.tenantId,
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        role: role || "EMPLOYEE",
        joining_date: joiningDate ? new Date(joiningDate) : undefined,
        manager_id: managerId || null,
        is_employee: true,
        is_active: true,
        can_login: false,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        joining_date: true,
        manager_id: true,
      },
    });
    return new Response(JSON.stringify({ success: true, data: newEmployee }), { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Failed to create employee" }), { status: 500 });
  }
}
