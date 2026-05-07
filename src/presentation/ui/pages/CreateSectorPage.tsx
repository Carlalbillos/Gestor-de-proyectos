import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/ui/components/ui/card";
import { Input } from "@/presentation/ui/components/ui/input";
import { Label } from "@/presentation/ui/components/ui/label";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ApiSectorRepository } from "@/infrastructure/adapters/ApiSectorRepository";
import { SectorService } from "@/application/services/SectorService";
import { createSectorSchema } from "@/presentation/ui/validators/create-sector.schema";
import type { CreateSectorFormData } from "@/presentation/ui/validators/create-sector.schema";

import { uuidv7 } from "@/presentation/ui/lib/uuid";

const sectorRepository = new ApiSectorRepository();
const sectorService = new SectorService(sectorRepository);

export const CreateSectorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateSectorFormData>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateSectorFormData): Promise<void> => {
    setIsLoading(true);

    try {
      await sectorService.createSector({
        id: uuidv7(),
        ...data,
      });
      navigate("/clientes");
    } catch (error: any) {
      console.error("Error creating sector", error);

      const status = error?.response?.status;
      let message = "Error al crear el sector. Revisa los datos e inténtalo de nuevo.";

      if (status === 409) {
        message = "Ya existe un sector con ese nombre.";
      }

      setError("name", {
        type: "server",
        message,
      });
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Sector</h1>
          <p className="text-muted-foreground">Rellena los datos para registrar un nuevo sector</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Información del Sector</CardTitle>
            <CardDescription>Introduce el nombre del nuevo sector</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Sector</Label>
              <Input
                id="name"
                placeholder="Ej: Tecnología"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
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
                  Crear Sector
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
