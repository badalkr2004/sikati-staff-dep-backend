import z from "zod";

export const quoteFormSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  eventType: z.enum([
    "government",
    "corporate",
    "private",
    "construction",
    "security",
    "hospitality",
    "other",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  duration: z
    .enum(["1day", "2-3days", "1week", "2weeks", "1month", "ongoing"])
    .optional(),
  staffNeeded: z.number().min(1, "At least 1 staff member is required"),
  location: z.string().min(1, "Location is required"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  specialRequirements: z.string().optional(),
  budgetRange: z
    .enum(["under5k", "5k-10k", "10k-25k", "25k-50k", "over50k", "discuss"])
    .optional(),
});
