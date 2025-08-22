import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { insertUserSchema, loginSchema } from "../db/schema";
import { z } from "zod";

const router: Router = Router();

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/logout", authenticate, AuthController.logout);
router.get("/profile", authenticate, AuthController.profile);

export default router;
