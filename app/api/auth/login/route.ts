import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { getSession, sessionOptions } from "@/lib/session";

// We need to convert Request to Node req/res via Next.js helper
export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

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

  // --- Session hack for Next API route compatibility ---
  const { cookies } = req as any;
  const res = new NextResponse(JSON.stringify({ message: "Logged in" }));
  const session = await getIronSession({ req: { cookies }, res }, sessionOptions);
  session.email = user.email;
  session.role = user.role;
  await session.save();

  return res;
}
