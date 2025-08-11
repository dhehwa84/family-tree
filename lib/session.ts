// lib/session.ts
import type { SessionOptions } from "iron-session";

const isSecure =
  process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : false; // on HTTP, keep this false

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD || process.env.SESSION_PASSWORD || "",
  cookieName: "family_auth",
  cookieOptions: {
    secure: isSecure,   // false for http
    sameSite: "lax",
    path: "/",
  },
};
