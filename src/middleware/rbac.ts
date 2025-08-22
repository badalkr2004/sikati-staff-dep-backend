import { type Response, type NextFunction } from "express";
import { type AuthRequest, Role } from "../types";
import { db } from "../db/conn";
import { permissions } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function authorizeRbac(resource: string, action: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // check if user has permission
      const userPermissions = await db
        .select()
        .from(permissions)
        .where(
          and(
            eq(permissions.resource, resource),
            eq(permissions.action, action),
            eq(permissions.role, req.user.role)
          )
        );

      if (!userPermissions.length) {
        return res.status(403).json({
          error: "insufficient permissions",
          required: { resource, action },
          userRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Authorization check failed" });
    }
  };
}

export function requiereRole(requiredRole: Role) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authorization required" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        error: "Insufficient role",
        required: requiredRole,
        current: req.user.role,
      });
    }

    next();
  };
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  return requiereRole(Role.ADMIN)(req, res, next);
}
