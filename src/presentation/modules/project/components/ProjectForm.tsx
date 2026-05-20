import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Label, FormInput, FormActions } from "@/presentation/ui";
import { Loader2, Briefcase, X } from "lucide-react";
import { useClientsListStore } from "@/presentation/modules/client/stores/clients-list.store";
import { createProjectSchema } from "@/presentation/modules/project/schemas/createProjectSchema";
import type { CreateProjectFormData } from "@/presentation/modules/project/schemas/createProjectSchema";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProjectForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSaving = false,
}: ProjectFormProps) => {
  const clients = useClientsListStore((state) => state.items);
  const isLoadingClients = useClientsListStore((state) => state.isLoading);
  const fetchClients = useClientsListStore((state) => state.fetchClients);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
      clientId: initialData?.client?.id || "",
    },
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const activeClients = clients.filter(c => c.isActive);

  return (
    <Card className="border-primary/50 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {initialData ? `Editar Proyecto: ${initialData.name}` : "Nuevo Proyecto"}
              </CardTitle>
              <CardDescription>
                {initialData 
                  ? "Modifica los detalles del proyecto actual" 
                  : "Rellena los datos para registrar un nuevo proyecto"}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel} disabled={isSaving}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <FormInput
            id="name"
            label="Nombre del Proyecto"
            placeholder="Ej: Portal de Clientes v2"
            registration={register("name")}
            error={errors.name?.message}
            disabled={isSaving}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe brevemente el objetivo del proyecto..."
              aria-invalid={!!errors.description}
              {...register("description")}
              disabled={isSaving}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="startDate"
              label="Fecha de Inicio"
              type="date"
              registration={register("startDate")}
              error={errors.startDate?.message}
              disabled={isSaving}
            />

            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <div className="relative">
                <select
                  id="clientId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  aria-invalid={!!errors.clientId}
                  {...register("clientId")}
                  disabled={isSaving || isLoadingClients}
                >
                  <option value="">Selecciona un cliente</option>
                  {activeClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {isLoadingClients && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {errors.clientId && (
                <p className="text-sm text-destructive">{errors.clientId.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6 bg-muted/20">
          <FormActions 
            className="pt-0 w-full justify-end"
            onCancel={onCancel}
            isSaving={isSaving}
            saveLabel={initialData ? "Actualizar Proyecto" : "Crear Proyecto"}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
