import { z } from "zod";

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(120, "El nombre no puede superar los 120 caracteres"),

  sectorId: z
    .string()
    .min(1, "Debes seleccionar un sector"),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
