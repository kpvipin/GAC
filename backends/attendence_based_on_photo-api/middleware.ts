import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/register"];

const allowedOrigins = [
  "http://localhost:3000",
  "https://attendencebasedonphoto-api.vercel.app",
];

// Utility to add CORS headers
function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin"); // <-- Required when sending dynamic origins
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
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
    return withCors(req, NextResponse.next());
  }
  console.log(req.method);
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return withCors(req, res);
  }

  console.log("Getting the token from cookie");
  const token = req.cookies.get("auth-token")?.value;
  console.log(req.cookies);
  console.log(token);
  if (!token) {
    return withCors(req, new NextResponse("Unauthorized", { status: 401 }));
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    jwtVerify(token, secret);
    return withCors(req, NextResponse.next());
  } catch (err) {
    return withCors(req, new NextResponse("Unauthorized", { status: 401 }));
  }
}
export const config = {
  matcher: "/api/:path*",
};
