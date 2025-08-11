export const runtime = 'nodejs'; // better-sqlite3 requires Node

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const db = new Database(path.resolve(process.cwd(), "family-tree.db"));
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Create the response FIRST
    const response = NextResponse.json({ message: "Logged in" });

    // ✅ Use the request + response overload (works across versions)
    const session = await getIronSession(request, response, sessionOptions);
    session.email = user.email;
    session.role = user.role;
    await session.save(); // writes Set-Cookie onto `response`

    return response;
  } catch (err) {
    console.error("LOGIN ROUTE ERROR:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
