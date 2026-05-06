import { z } from "zod";

export const createContactSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(254, "El nombre no puede superar los 254 caracteres"),
  email: z
    .string()
    .email("Introduce un email válido")
    .max(254, "El emai  l no puede superar los 254 caracteres"),
  phoneNumber: z
    .string()
    .max(30, "El teléfono no puede superar los 30 caracteres")
    .optional()
    .or(z.literal("")),
  isMain: z.boolean(),
  note: z
    .string()
    .max(500, "La nota no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateContactFormData = z.infer<typeof createContactSchema>;
