import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries, type User } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: Omit<User, "password_hash">): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = userQueries.getByEmail.get(email) as any
  if (!user) return null

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}
