import { z } from "zod";

export const updateClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(120, "El nombre no puede superar los 120 caracteres"),

  sectorId: z
    .string()
    .min(1, "Debes seleccionar un sector"),

  isActive: z.boolean(),
});

export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
