import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import type { ProjectDevelopment, Technology } from "@/domain/entities/project.entity";
import { DeleteButton } from "../shared/delete-button";

const developmentSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  technologyId: z.string().min(1, "Debes seleccionar una tecnología"),
  urlRepository: z.string().url("Debe ser una URL válida"),
  links: z.array(z.object({
    environment: z.string().min(1, "El entorno es obligatorio"),
    url: z.string().url("Debe ser una URL válida"),
  })),
});

type DevelopmentFormValues = z.infer<typeof developmentSchema>;

interface ProjectDevelopmentFormProps {
  initialData?: ProjectDevelopment;
  technologies: Technology[];
  onSubmit: (data: DevelopmentFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProjectDevelopmentForm = ({
  initialData,
  technologies,
  onSubmit,
  onCancel,
  isSaving = false,
}: ProjectDevelopmentFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DevelopmentFormValues>({
    resolver: zodResolver(developmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      technologyId: initialData?.technology?.id || "",
      urlRepository: initialData?.urlRepository || "",
      links: initialData?.links.map(l => ({ environment: l.environment, url: l.url })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre del Desarrollo</Label>
          <Input
            id="name"
            placeholder="Ej: Frontend Web, App Mobile, API REST..."
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe brevemente el propósito de este desarrollo..."
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="technologyId">Tecnología Principal</Label>
            <select
              id="technologyId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("technologyId")}
            >
              <option value="">Selecciona una tecnología...</option>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
            {errors.technologyId && <p className="text-xs text-destructive">{errors.technologyId.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="urlRepository">URL del Repositorio</Label>
            <Input
              id="urlRepository"
              placeholder="https://github.com/..."
              {...register("urlRepository")}
              className={errors.urlRepository ? "border-destructive" : ""}
            />
            {errors.urlRepository && <p className="text-xs text-destructive">{errors.urlRepository.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Enlaces de Entorno (Despliegues)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ environment: "", url: "" })}
            className="h-8 gap-1"
          >
            <Plus className="h-4 w-4" />
            Añadir Entorno
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic py-2">
            No hay enlaces adicionales registrados.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex-1 grid gap-2">
                <Input
                  placeholder="Entorno (ej: Producción, Staging)"
                  {...register(`links.${index}.environment` as const)}
                  className={errors.links?.[index]?.environment ? "border-destructive" : ""}
                />
              </div>
              <div className="flex-[2] grid gap-2">
                <Input
                  placeholder="https://..."
                  {...register(`links.${index}.url` as const)}
                  className={errors.links?.[index]?.url ? "border-destructive" : ""}
                />
              </div>
              <DeleteButton
                onClick={() => remove(index)}
                label={undefined}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            initialData ? "Actualizar Desarrollo" : "Crear Desarrollo"
          )}
        </Button>
      </div>
    </form>
  );
};
