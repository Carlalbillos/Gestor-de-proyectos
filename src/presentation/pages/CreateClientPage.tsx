import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/components/ui/card";
import { FormInput } from "@/presentation/components/shared/FormInput";
import { FormActions } from "@/presentation/components/shared/form-actions";
import { ChevronLeft } from "lucide-react";
import { useClientsListStore } from "@/presentation/stores/clients-list.store";
import { SectorSelect } from "@/presentation/components/sectors/SectorSelect";

import { createClientSchema } from "@/presentation/schemas/client/createClientSchema";
import type { CreateClientFormData } from "@/presentation/schemas/client/createClientSchema";

import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { isAxiosError } from "axios";

export const CreateClientPage = () => {
  const navigate = useNavigate();
  const addClient = useClientsListStore((state) => state.addClient);
  const isSaving = useClientsListStore((state) => state.isSaving);

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
    try {
      await addClient({
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
            <FormInput
              id="name"
              label="Nombre del Cliente"
              placeholder="Ej: Acme Corp"
              registration={register("name")}
              error={errors.name?.message}
            />

            <SectorSelect
              id="sectorId"
              error={errors.sectorId?.message}
              {...register("sectorId")}
            />
          </CardContent>
          <CardFooter className="border-t p-6 bg-muted/20">
            <FormActions
              className="pt-0 w-full justify-end"
              onCancel={() => navigate("/clientes")}
              isSaving={isSaving}
              saveLabel="Crear Cliente"
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
