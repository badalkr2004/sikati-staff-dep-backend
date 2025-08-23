import type { Response } from "express";
import type { AuthRequest } from "../types";
import { db } from "../db/conn";
import { emergency, quoteRequests } from "../db/schema";
import z from "zod";
import { quoteFormSchema } from "../validation/quote.validation";
import { eq } from "drizzle-orm";
import {
  notifyContact,
  notifyEmergency,
  notifyQuote,
} from "../utils/mailTemplate";

export class ContactController {
  static async handleContactForm(req: AuthRequest, res: Response) {
    const { firstName, lastName, company, email, phone, message } = req.body;
    console.log(req.body);
    try {
      // Validate and process the contact form data
      await notifyContact({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        message,
        company,
      });
      res.json({
        success: true,
        message: "Contact form submitted successfully",
      });
    } catch (error) {
      console.error("Error handling contact form:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

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
      await notifyEmergency({
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

      res.json({ success: true, message: "Emergency contact form submitted" });
    } catch (error) {
      console.error("Error handling emergency contact:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
      return;
    }
  }
  static async getEmergencyContact(req: AuthRequest, res: Response) {
    try {
      const emergencyContacts = await db.select().from(emergency);

      res.json({ success: true, data: emergencyContacts });
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
  static async getEmergencyContactById(req: AuthRequest, res: Response) {
    const { id } = req.params as { id: string };

    try {
      const emergencyContact = await db
        .select()
        .from(emergency)
        .where(eq(emergency.id, id))
        .limit(1);

      if (!emergencyContact.length) {
        return res.status(404).json({
          success: false,
          error: "Emergency contact not found",
        });
      }

      res.json({ success: true, data: emergencyContact[0] });
    } catch (error) {
      console.error("Error fetching emergency contact:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async updateEmergencyContact(req: AuthRequest, res: Response) {
    const {
      id,
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
      const result = await db
        .update(emergency)
        .set({
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
        })
        .where(eq(emergency.id, id))
        .returning();

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Emergency contact not found",
        });
      }

      res.json({ success: true, message: "Emergency contact updated" });
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async deleteEmergencyContact(req: AuthRequest, res: Response) {
    const { id } = req.params as { id: string };

    try {
      const result = await db
        .delete(emergency)
        .where(eq(emergency.id, id))
        .returning();

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Emergency contact not found",
        });
      }

      res.json({ success: true, message: "Emergency contact deleted" });
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async handleQuoteRequest(req: AuthRequest, res: Response) {
    try {
      // Validate request body
      const parsedData = quoteFormSchema.parse(req.body);

      // Insert into DB
      const result = await db
        .insert(quoteRequests)
        .values({
          contactName: parsedData.contactName,
          companyName: parsedData.companyName,
          email: parsedData.email,
          phone: parsedData.phone,
          eventType: parsedData.eventType,
          startDate: parsedData.startDate, // ✅ convert to Date
          duration: parsedData.duration,
          staffNeeded: parsedData.staffNeeded,
          location: parsedData.location,
          services: parsedData.services, // text[]
          specialRequirements: parsedData.specialRequirements,
          budgetRange: parsedData.budgetRange,
        })
        .returning();

      await notifyQuote({
        contactName: parsedData.contactName,
        companyName: parsedData.companyName,
        email: parsedData.email,
        phone: parsedData.phone,
        eventType: parsedData.eventType,
        startDate: parsedData.startDate,
        duration: parsedData.duration,
        staffNeeded: parsedData.staffNeeded as unknown as string,
        location: parsedData.location,
        services: parsedData.services,
        specialRequirements: parsedData.specialRequirements as string,
        budgetRange: parsedData.budgetRange as string,
      });

      return res.status(201).json({
        success: true,
        message: "Quote request submitted successfully",
        data: result[0],
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      console.error("Error creating quote request:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getQuoteRequest(req: AuthRequest, res: Response) {
    try {
      const quoteRequestsData = await db.select().from(quoteRequests);

      res.json({ success: true, data: quoteRequestsData });
    } catch (error) {
      console.error("Error fetching quote requests:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async getQuoteRequestById(req: AuthRequest, res: Response) {
    const { id } = req.params as { id: string };

    try {
      const quoteRequest = await db
        .select()
        .from(quoteRequests)
        .where(eq(quoteRequests.id, id))
        .limit(1);

      if (!quoteRequest.length) {
        return res.status(404).json({
          success: false,
          error: "Quote request not found",
        });
      }

      res.json({ success: true, data: quoteRequest[0] });
    } catch (error) {
      console.error("Error fetching quote request:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async updateQuoteRequest(req: AuthRequest, res: Response) {
    const { id } = req.params as { id: string };
    const {
      contactName,
      companyName,
      email,
      phone,
      eventType,
      startDate,
      duration,
      staffNeeded,
      location,
      services,
      specialRequirements,
      budgetRange,
    } = req.body;

    try {
      const result = await db
        .update(quoteRequests)
        .set({
          contactName,
          companyName,
          email,
          phone,
          eventType,
          startDate: startDate,
          duration,
          staffNeeded,
          location,
          services,
          specialRequirements,
          budgetRange,
        })
        .where(eq(quoteRequests.id, id))
        .returning();

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Quote request not found",
        });
      }

      res.json({ success: true, message: "Quote request updated" });
    } catch (error) {
      console.error("Error updating quote request:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  static async deleteQuoteRequest(req: AuthRequest, res: Response) {
    const { id } = req.params as { id: string };

    try {
      const result = await db
        .delete(quoteRequests)
        .where(eq(quoteRequests.id, id))
        .returning();

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Quote request not found",
        });
      }

      res.json({ success: true, message: "Quote request deleted" });
    } catch (error) {
      console.error("Error deleting quote request:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
}
