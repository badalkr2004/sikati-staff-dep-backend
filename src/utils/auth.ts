import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type User } from "../types";

import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function generateToken(user: User): Promise<string> {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return await jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as StringValue,
  });
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded as User;
  } catch (error) {
    return null;
  }
}
