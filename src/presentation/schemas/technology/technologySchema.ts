import { z } from "zod";

export const technologySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

export type TechnologyFormData = z.infer<typeof technologySchema>;
