import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const dbPath = path.resolve(process.cwd(), "family-tree.db");
  const db = new Database(dbPath);

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create response and attach session
  const response = NextResponse.json({ message: "Logged in" });

  const session = await getIronSession(req.cookies, sessionOptions);
  session.email = user.email;
  session.role = user.role;
  await session.save();

  // ⬇️ This is critical: persist the cookie manually
  response.cookies.set("family_auth", req.cookies.get("family_auth")?.value || "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
