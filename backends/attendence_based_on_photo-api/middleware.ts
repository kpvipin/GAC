import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/register"];

// Utility to add CORS headers
function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

export function middleware(req: NextRequest) {
  console.log("Inside middleware");
  //Pass public Routes
  const { pathname } = req.nextUrl;
  console.log(pathname);
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return withCors(NextResponse.next());
  }
  console.log(req.method);
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return withCors(res);
  }

  console.log("Getting the token from cookie");
  const token = req.cookies.get("auth-token")?.value;
  console.log(req.cookies);
  console.log(token);
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    jwtVerify(token, secret);
    return withCors(NextResponse.next());
  } catch (err) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
export const config = {
  matcher: "/api/:path*",
};
