import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  surname: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios")
    .max(100, "Los apellidos no pueden superar los 100 caracteres"),

  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("El email no tiene un formato válido")
    .max(150, "El email no puede superar los 150 caracteres"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),

  role: z
    .string()
    .min(1, "Debes seleccionar un rol"),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
