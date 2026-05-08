import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/ui/components/ui/card";
import { Input } from "@/presentation/ui/components/ui/input";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/ClientService";
import { SectorSelect } from "@/presentation/ui/components/sectors/SectorSelect";

import { createClientSchema } from "@/presentation/ui/validators/create-client.schema";
import type { CreateClientFormData } from "@/presentation/ui/validators/create-client.schema";

import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { isAxiosError } from "axios";

const clientRepository = new ApiClientRepository();
const clientService = new ClientService(clientRepository);

export const CreateClientPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      sectorId: "",
    },
  });

  const onSubmit = async (data: CreateClientFormData): Promise<void> => {
    setIsLoading(true);

    try {
      await clientService.createClient({
        id: uuidv7(),
        ...data,
      });
      navigate("/clientes");
    } catch (error: unknown) {
      console.error("Error creating client", error);
      const status = isAxiosError(error) ? error.response?.status : undefined;
      let message = "Error al crear el cliente. Revisa los datos e inténtalo de nuevo.";

      if (status === 409) {
        message = "Ya existe un cliente con esos datos.";
      } else if (status === 404) {
        message = "El sector seleccionado no existe.";
      }

      setError("name", {
        type: "server",
        message,
      });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/clientes")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
          <p className="text-muted-foreground">Rellena los datos para registrar un nuevo cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos del cliente y sector asociado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nombre del Cliente
              </label>
              <Input
                id="name"
                placeholder="Ej: Acme Corp"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <SectorSelect 
              id="sectorId"
              error={errors.sectorId?.message}
              {...register("sectorId")}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => navigate("/clientes")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[140px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Cliente
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
