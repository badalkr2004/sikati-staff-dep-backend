import type { Request, Response } from "express";
import { db } from "../db/conn";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";
import { Role, type AuthRequest } from "../types";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password, role } = req.body;

      // check if user already exist

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length) {
        return res.status(400).json({ error: "User Already exist" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // create User
      const newUser = await db
        .insert(users)
        .values({ email, username, passwordHash, role: role || Role.MEMBER })
        .returning();

      if (!newUser.length || !newUser[0]) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      const user = {
        ...newUser[0],
        role: newUser[0].role as Role,
      };
      if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      // Generate Token
      const token = await generateToken(user);
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
      });
    } catch (error) {}
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      // Find user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (
        !existingUser.length ||
        !existingUser[0] ||
        !existingUser[0].isActive
      ) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = {
        ...existingUser[0],
        role: existingUser[0].role as Role,
      };

      // Verify password
      const isValidPassword = await comparePassword(
        password,
        user.passwordHash
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = await generateToken(user);

      // Store session
      await db.insert(sessions).values({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        await db.delete(sessions).where(eq(sessions.token, token));
      }

      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  }

  static async profile(req: AuthRequest, res: Response) {
    res.json({
      user: req.user,
    });
  }
}
