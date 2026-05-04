import { z } from "zod";

export const adminChangePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Debes confirmar la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type AdminChangePasswordFormData = z.infer<typeof adminChangePasswordSchema>;

export const userChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "La contraseña actual es obligatoria"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
    .max(100, "La nueva contraseña no puede superar los 100 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Debes confirmar la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type UserChangePasswordFormData = z.infer<typeof userChangePasswordSchema>;
