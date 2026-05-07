import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/ui/components/ui/card";
import { Input } from "@/presentation/ui/components/ui/input";
import { Label } from "@/presentation/ui/components/ui/label";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/ClientService";
import { ApiSectorRepository } from "@/infrastructure/adapters/ApiSectorRepository";
import { SectorService } from "@/application/services/SectorService";

import { createClientSchema } from "@/presentation/ui/validators/create-client.schema";
import type { CreateClientFormData } from "@/presentation/ui/validators/create-client.schema";
import type { Sector } from "@/domain/entities/sector.entity";

import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { isAxiosError } from "axios";

const clientRepository = new ApiClientRepository();
const clientService = new ClientService(clientRepository);
const sectorRepository = new ApiSectorRepository();
const sectorService = new SectorService(sectorRepository);

export const CreateClientPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoadingSectors, setIsLoadingSectors] = useState(true);

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

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await sectorService.getSectors();
        setSectors(data);
        setIsLoadingSectors(false);
      } catch (error) {
        console.error("Error fetching sectors", error);
        setIsLoadingSectors(false);
      }
    };
    fetchSectors();
  }, []);

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
              <Label htmlFor="name">Nombre del Cliente</Label>
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

            <div className="space-y-2">
              <Label htmlFor="sectorId">Sector</Label>
              <select
                id="sectorId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors.sectorId}
                {...register("sectorId")}
              >
                <option value="">Selecciona un sector</option>
                {sectors.map(sector => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
              {errors.sectorId && (
                <p className="text-sm text-destructive">{errors.sectorId.message}</p>
              )}
              {isLoadingSectors && <p className="text-xs text-muted-foreground animate-pulse">Cargando sectores...</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => navigate("/clientes")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingSectors} className="min-w-[140px]">
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
