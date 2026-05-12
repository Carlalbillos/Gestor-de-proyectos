import * as z from "zod";

export const createTimeEntrySchema = z.object({
  date: z.string().min(1, "La fecha es obligatoria"),
  hour: z.coerce.number({ message: "Debe ser un número válido" })
    .min(0.5, "Mínimo 0.5 horas")
    .max(24, "Máximo 24 horas por día"),
  comment: z.string().max(50, "El comentario debe tener 50 caracteres como máximo"),
});

export type CreateTimeEntryFormValues = z.infer<typeof createTimeEntrySchema>;
