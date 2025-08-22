import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";

const router: Router = Router();

router.post("/emergency", ContactController.handleEmergencyContact);

export default router;
