import { hashPassword } from "../utils/auth";
import { db } from "./conn";
import { permissions, users } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await db.insert(users).values({
    email: "admin@example.com",
    username: "admin",
    passwordHash: adminPassword,
    role: "admin",
  });

  // Create member user
  const memberPassword = await hashPassword("member123");
  await db.insert(users).values({
    email: "member@example.com",
    username: "member",
    passwordHash: memberPassword,
    role: "member",
  });

  // Seed permissions
  const permissionsData = [
    // Admin permissions
    { resource: "users", action: "create", role: "admin" },
    { resource: "users", action: "read", role: "admin" },
    { resource: "users", action: "update", role: "admin" },
    { resource: "users", action: "delete", role: "admin" },
    { resource: "posts", action: "create", role: "admin" },
    { resource: "posts", action: "read", role: "admin" },
    { resource: "posts", action: "update", role: "admin" },
    { resource: "posts", action: "delete", role: "admin" },

    // Member permissions
    { resource: "posts", action: "read", role: "member" },
    { resource: "posts", action: "create", role: "member" },
    { resource: "profile", action: "read", role: "member" },
    { resource: "profile", action: "update", role: "member" },
  ];

  await db.insert(permissions).values(permissionsData as any);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed!", err);
  process.exit(1);
});
