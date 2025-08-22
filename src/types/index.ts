import type { Request } from "express";

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = "admin",
  MEMBER = "member",
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface Permission {
  resource: string;
  action: string;
}
