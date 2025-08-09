// lib/session.ts
import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD || process.env.SESSION_PASSWORD || "",
  cookieName: "family_auth",
  cookieOptions: {
    secure: process.env.COOKIE_SECURE === "true", // false if running over HTTP
    sameSite: "lax",
    path: "/",
  },
};
