import { prisma } from "./prisma";

export async function ensureTenantAccess(user: any, tenantId: string) {
  if (user.role === "SUPER_ADMIN") return true;
  return user.tenantId === tenantId;
}
