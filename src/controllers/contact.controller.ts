import type { Response } from "express";
import type { AuthRequest } from "../types";
import { db } from "../db/conn";
import { emergency } from "../db/schema";

export class ContactController {
  static async handleEmergencyContact(req: AuthRequest, res: Response) {
    const {
      name,
      phone,
      email,
      company,
      urgency,
      staffNeeded,
      location,
      startDateTime,
      duration,
      workType,
      emergencyDescription,
      specialRequirements,
      contact,
    } = req.body;

    try {
      const result = await db.insert(emergency).values({
        name,
        phone,
        email,
        company,
        urgency,
        staffNeeded,
        location,
        startDateTime: new Date(startDateTime),
        duration,
        workType,
        emergencyDescription,
        specialRequirements,
        contact,
      });

      if (!result) {
        return res.status(500).json({
          success: false,
          error: "Failed to create emergency contact",
        });
      }

      res.json({ success: true, message: "Emergency contact form submitted" });
    } catch (error) {
      console.error("Error handling emergency contact:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
      return;
    }
  }
}
