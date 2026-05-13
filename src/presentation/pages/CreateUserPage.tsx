import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/presentation/components/ui/card";
import { Label } from "@/presentation/components/ui/label";
import { FormInput } from "@/presentation/components/shared/FormInput";
import { FormActions } from "@/presentation/components/shared/form-actions";
import { ChevronLeft } from "lucide-react";
import { useUsersListStore } from "@/presentation/stores/users-list.store";
import { createUserSchema } from "@/presentation/schemas/createUserSchema";
import type { CreateUserFormData } from "@/presentation/schemas/createUserSchema";

import { uuidv7 } from "@/presentation/ui/lib/uuid";

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const addUser = useUsersListStore((state) => state.addUser);
  const isSaving = useUsersListStore((state) => state.isSaving);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: CreateUserFormData): Promise<void> => {
    try {
      await addUser({
        id: uuidv7(),
        ...data,
      });
      navigate("/personal");
    } catch (error: any) {
      console.error("Error creating user", error);

      const status = error?.response?.status;
      let message = "Error al crear el usuario. Revisa los datos e inténtalo de nuevo.";

      if (status === 409) {
        message = "Ya existe un usuario con ese email.";
        setError("email", { type: "server", message });
      } else {
        setError("name", { type: "server", message });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/personal")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Usuario</h1>
          <p className="text-muted-foreground">Rellena los datos para registrar un nuevo usuario</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>Datos personales y credenciales de acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="name"
                label="Nombre"
                placeholder="Ej: Juan"
                registration={register("name")}
                error={errors.name?.message}
              />

              <FormInput
                id="surname"
                label="Apellidos"
                placeholder="Ej: García López"
                registration={register("surname")}
                error={errors.surname?.message}
              />
            </div>

            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="Ej: juan.garcia@empresa.com"
              registration={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              registration={register("password")}
              error={errors.password?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors.role}
                {...register("role")}
              >
                <option value="">Selecciona un rol</option>
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 bg-muted/20">
            <FormActions 
              className="pt-0 w-full justify-end"
              onCancel={() => navigate("/personal")}
              isSaving={isSaving}
              saveLabel="Crear Usuario"
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
