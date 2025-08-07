import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cookies } = req as any;
  const res = new NextResponse(JSON.stringify({ message: "Logged out" }));
  const session = await getIronSession({ req: { cookies }, res }, sessionOptions);
  await session.destroy();
  return res;
}
