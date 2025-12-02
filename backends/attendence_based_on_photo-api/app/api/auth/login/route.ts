import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { ok, bad } from "@/lib/responses";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  // Find the user by email who can login
  const user = await prisma.users.findFirst({
    where: {
      email,
      can_login: true, // only users allowed to login
    },
    include: {
      tenants: true, // optional, for token info
    },
  });
  if (!user) {
    console.log("User not found in DB");
    return bad("Invalid email or password");
  }
  // Compare password
  if (!user.password_hash) {
    console.log("Password is not found")
    return bad("Invalid email or password");
  }
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    console.log("Invalid password");
    return bad("Invalid email or password");
  }
  // Sign JWT
  const token = signToken({
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role,
  });
  // Prepare secure cookie response
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: true, // only HTTPS in prod
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}
