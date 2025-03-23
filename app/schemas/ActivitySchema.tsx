import { z } from "zod";

// Define the schema for the form
export const ActivitySchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.date(),
  cropId: z.string().min(1, "Crop is required"), // Crop ID as a string
});

// Infer the type from the schema
export type ActivityFormData = z.infer<typeof ActivitySchema>;