import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";
import { getCurrentDateTimeInTenantTZ } from "@/app/common/utils";

export async function GET(req: Request) {
  try {
    const loggedInUser = getLoggedInUser(req);
    if (!loggedInUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const currentDateTimeInTenantTZ = getCurrentDateTimeInTenantTZ(loggedInUser.tenantId);
    return NextResponse.json({
      success: true,
      currentDateTimeInTenantTZ: currentDateTimeInTenantTZ,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch tenant time" },
      { status: 500 }
    );
  }
}
