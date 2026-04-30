import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar los 100 caracteres"),

  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  start_date: z
    .string()
    .min(1, "La fecha de inicio es obligatoria"),

  client_id: z
    .string()
    .min(1, "Debes seleccionar un cliente"),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
