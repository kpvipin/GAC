export function ok(data: any) {
  return Response.json({ success: true, data });
}

export function bad(message: string) {
  return new Response(JSON.stringify({ success: false, message }), { status: 400 });
}

export function unauthorized() {
  return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
}
