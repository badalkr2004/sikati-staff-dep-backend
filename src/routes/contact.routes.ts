import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { authenticate, authorize } from "../middleware/auth";

const router: Router = Router();

router.post("/", ContactController.handleContactForm);

router.get(
  "/emergency",
  authenticate,
  authorize(["admin"]),
  ContactController.getEmergencyContact
);
router.get(
  "/emergency/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.getEmergencyContactById
);
router.post("/emergency", ContactController.handleEmergencyContact);
router.put(
  "/emergency/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.updateEmergencyContact
);
router.delete(
  "/emergency/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.deleteEmergencyContact
);

router.get(
  "/quotes",
  authenticate,
  authorize(["admin"]),
  ContactController.getQuoteRequest
);
router.post("/quotes", ContactController.handleQuoteRequest);

router.get(
  "/quotes/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.getQuoteRequestById
);

router.put(
  "/quotes/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.updateQuoteRequest
);
router.delete(
  "/quotes/:id",
  authenticate,
  authorize(["admin"]),
  ContactController.deleteQuoteRequest
);
export default router;
