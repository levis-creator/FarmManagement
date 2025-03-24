import { z } from "zod";

// Define the schema for the form
export const CropSchema = z.object({
  name: z.string().min(1, "Name is required"),
  variety: z.string().min(1, "Variety is required"),
  plantingDate: z.union([z.date(), z.coerce.date()]),
  harvestDate: z.union([z.date(), z.coerce.date()]),
  status: z.enum(["Planting", "Growing", "Harvesting"]),
});

// Infer the type from the schema
export type CropFormData = z.infer<typeof CropSchema>;