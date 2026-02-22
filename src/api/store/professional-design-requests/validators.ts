import { z } from "zod";

export const PostStoreProfessionalDesignRequestSchema = z.object({
  company_name: z.string(),
  industry: z.string(),
  description: z.string(),
  accent_colors: z.string().optional(),
  style: z.string().optional(),
  contact_name: z.string(),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
});
