import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/ui/components/ui/card";
import { Label } from "@/presentation/ui/components/ui/label";
import { FormInput } from "@/presentation/ui/components/shared/FormInput";
import { FormActions } from "@/presentation/ui/components/shared/form-actions";
import { ChevronLeft } from "lucide-react";
import { useAsync } from "@/presentation/hooks/useAsync";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ProjectService } from "@/application/services/ProjectService";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/ClientService";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";
import { createProjectSchema } from "@/presentation/ui/validators/create-project.schema";
import type { CreateProjectFormData } from "@/presentation/ui/validators/create-project.schema";
import type { Client } from "@/domain/ports/ClientRepository";

import { uuidv7 } from "@/presentation/ui/lib/uuid";

const projectRepository = new ApiProjectRepository();
const projectService = new ProjectService(projectRepository);
const clientRepository = new ApiClientRepository();
const clientService = new ClientService(clientRepository);

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { execute: createProject, isLoading } = useAsync(projectService.createProject.bind(projectService));
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date().toISOString().split('T')[0],
      clientId: "",
    },
  });

  useEffect(() => {
    if (user && !isAdmin(user)) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientService.getClients({ limit: 9999 });
        setClients(response.data.filter(c => c.isActive));
        setIsLoadingClients(false);
      } catch (error) {
        console.error("Error fetching clients", error);
        setIsLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data: CreateProjectFormData): Promise<void> => {
    try {
      await createProject({
        id: uuidv7(),
        ...data,
      });
      navigate("/proyectos");
    } catch (error) {
      console.error("Error creating project", error);
      setError("name", {
        type: "server",
        message: "Error al crear el proyecto. Revisa los datos e inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/proyectos")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h1>
          <p className="text-muted-foreground">Rellena los datos para registrar un nuevo proyecto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Detalles básicos del proyecto y cliente asociado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              id="name"
              label="Nombre del Proyecto"
              placeholder="Ej: Portal de Clientes v2"
              registration={register("name")}
              error={errors.name?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe brevemente el objetivo del proyecto..."
                aria-invalid={!!errors.description}
                {...register("description")}
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
              />

              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente</Label>
                <select
                  id="clientId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!errors.clientId}
                  {...register("clientId")}
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-sm text-destructive">{errors.clientId.message}</p>
                )}
                {isLoadingClients && <p className="text-xs text-muted-foreground animate-pulse">Cargando clientes...</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 bg-muted/20">
            <FormActions 
              className="pt-0 w-full justify-end"
              onCancel={() => navigate("/proyectos")}
              isSaving={isLoading || isLoadingClients}
              saveLabel="Crear Proyecto"
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
