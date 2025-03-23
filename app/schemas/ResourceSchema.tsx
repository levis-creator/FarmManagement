import { z } from "zod";

// Define the schema for the form
export const ResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  type: z.string().min(1, "Type is required"),
  cropId: z.string().min(1, "Crop is required"), // Crop ID as a string
});

// Infer the type from the schema
export type ResourceFormData = z.infer<typeof ResourceSchema>;