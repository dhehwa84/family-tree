import { sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getIronSession(
    req.cookies, // ✅ Pass cookie store directly
    sessionOptions
  );

  return NextResponse.json({
    email: session.email ?? null,
    role: session.role ?? null,
  });
}
