import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { ok, bad } from "@/lib/responses";

export async function POST(req: Request) {
  const { tenantName, fullName, email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);
  const tenant = await prisma.tenants.create({
    data: {
      name: tenantName,
      users: {
        create: {
          full_name: fullName,
          email,
          password_hash: hash,
          role: "OWNER",
          can_login: true,
        },
      },
    },
    include: {
      users: true, // <-- Include related users
    },
  });
  const token = signToken({
    userId: tenant.users[0].id,
    tenantId: tenant.id,
    role: "OWNER",
  });
  return ok({ token });
}
