import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/infrastructure/ui/components/ui/card";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Label } from "@/infrastructure/ui/components/ui/label";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ProjectService } from "@/application/services/project.service";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/client.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { isAdmin } from "@/infrastructure/ui/lib/roleChecker";
import { createProjectSchema } from "@/infrastructure/ui/validators/create-project.schema";
import type { CreateProjectFormData } from "@/infrastructure/ui/validators/create-project.schema";
import type { Client } from "@/domain/ports/ClientRepository";

import { uuidv7 } from "@/infrastructure/ui/lib/uuid";

const projectRepository = new ApiProjectRepository();
const projectService = new ProjectService(projectRepository);
const clientRepository = new ApiClientRepository();
const clientService = new ClientService(clientRepository);

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
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
      start_date: new Date().toISOString().split('T')[0],
      client_id: "",
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
        const data = await clientService.getClients();
        setClients(data.filter(c => c.is_active));
        setIsLoadingClients(false);
      } catch (error) {
        console.error("Error fetching clients", error);
        setIsLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data: CreateProjectFormData): Promise<void> => {
    setIsLoading(true);

    try {
      await projectService.createProject({
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
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
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
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                placeholder="Ej: Portal de Clientes v2"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
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
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  aria-invalid={!!errors.start_date}
                  {...register("start_date")}
                />
                {errors.start_date && (
                  <p className="text-sm text-destructive">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente</Label>
                <select
                  id="client_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!errors.client_id}
                  {...register("client_id")}
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.client_id && (
                  <p className="text-sm text-destructive">{errors.client_id.message}</p>
                )}
                {isLoadingClients && <p className="text-xs text-muted-foreground animate-pulse">Cargando clientes...</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => navigate("/proyectos")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingClients} className="min-w-[140px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Proyecto
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
