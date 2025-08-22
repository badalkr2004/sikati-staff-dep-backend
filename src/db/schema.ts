import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roleEnum = pgEnum("role", ["admin", "member"]);
export const urgencyEnum = pgEnum("urgency", [
  "immediate",
  "same-day",
  "next-day",
  "weekend",
]);

export const durationEnum = pgEnum("duration", [
  "few-hours",
  "half-day",
  "full-day",
  "multiple-days",
  "ongoing",
]);

export const workTypeEnum = pgEnum("work_type", [
  "event-support",
  "security",
  "labor",
  "admin",
  "technical",
  "cleaning",
  "other",
]);

export const contactEnum = pgEnum("contact", ["call", "text", "email"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  resource: varchar("resource", { length: 100 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  role: roleEnum("role").notNull(),
});

// emergency contact
export const emergency = pgTable("emergency", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),

  urgency: urgencyEnum("urgency").notNull(),
  staffNeeded: integer("staff_needed").notNull(),

  location: text("location").notNull(),
  startDateTime: timestamp("start_date_time", {
    withTimezone: true,
  }).notNull(),

  duration: durationEnum("duration").notNull(),
  workType: workTypeEnum("work_type").notNull(),

  emergencyDescription: text("emergency_description").notNull(),
  specialRequirements: text("special_requirements"),

  contact: contactEnum("contact").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// schemas for validation

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users).omit({
  passwordHash: true,
});

export const loginSchema = createInsertSchema(users)
  .pick({
    email: true,
  })
  .extend({
    password: text("password"),
  });
