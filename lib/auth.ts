import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getPortfolioData } from "./db";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-admin-secret-key-at-least-32-bytes-long!!"
);

export const COOKIE_NAME = "admin_session";

export interface SessionPayload {
  username: string;
  role: "admin";
}

export async function createSession(username: string): Promise<string> {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(password: string): Promise<boolean> {
  const data = await getPortfolioData();
  return bcrypt.compare(password, data.admin.passwordHash);
}
