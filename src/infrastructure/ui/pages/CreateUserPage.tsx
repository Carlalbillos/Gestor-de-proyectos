import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/infrastructure/ui/components/ui/card";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Label } from "@/infrastructure/ui/components/ui/label";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { ApiUserRepository } from "@/infrastructure/adapters/ApiUserRepository";
import { UserService } from "@/application/services/user.service";
import { createUserSchema } from "@/infrastructure/ui/validators/create-user.schema";
import type { CreateUserFormData } from "@/infrastructure/ui/validators/create-user.schema";

import { uuidv7 } from "@/infrastructure/ui/lib/uuid";

const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      await userService.createUser({
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

      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
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
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Juan"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Apellidos</Label>
                <Input
                  id="surname"
                  placeholder="Ej: García López"
                  aria-invalid={!!errors.surname}
                  {...register("surname")}
                />
                {errors.surname && (
                  <p className="text-sm text-destructive">{errors.surname.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej: juan.garcia@empresa.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

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
          <CardFooter className="flex justify-end gap-3 border-t p-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => navigate("/personal")} disabled={isLoading}>
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
                  Crear Usuario
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
