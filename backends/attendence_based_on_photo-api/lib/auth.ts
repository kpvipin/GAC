import jwt from "jsonwebtoken";

export function signToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

interface JwtUserPayload {
  userId: string;
  tenantId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function getLoggedInUser(req: Request) {
  console.log("Cookies", req.headers.get("cookie"));
  const token = req.headers.get("cookie")
    ?.split("; ")
    ?.find((c) => c.startsWith("auth-token="))
    ?.split("=")[1];
  console.log(token);  
  if (!token) throw new Error("Unauthorized");
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
  } catch {
    throw new Error("Invalid token");
  }
}
