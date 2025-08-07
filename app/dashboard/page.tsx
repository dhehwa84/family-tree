// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getIronSession(cookies(), sessionOptions);

  if (!session.email) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.email}</h1>
      <p>Role: {session.role}</p>
    </div>
  );
}
