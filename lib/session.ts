// lib/session.ts
import { getIronSession } from "iron-session";

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "family_auth",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function getSession(req: any, res: any) {
  return getIronSession(req, res, sessionOptions);
}
