import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types";
import { verifyToken } from "../utils/auth";
import { db } from "../db/conn";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded?.id))
      .limit(1);

    if (!user.length || !user[0]?.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    req.user = {
      id: user[0].id,
      email: user[0].email,
      username: user[0]?.username,
      role: user[0].role as any,
      isActive: user[0].isActive,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }

    const hasRole = roles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
