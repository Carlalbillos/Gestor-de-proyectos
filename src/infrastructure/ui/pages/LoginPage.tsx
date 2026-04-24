import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { loginSchema } from "@/infrastructure/ui/validators/login.schema";
import type { LoginFormData } from "@/infrastructure/ui/validators/login.schema";

import { Button } from "@/infrastructure/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/ui/components/ui/card";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Label } from "@/infrastructure/ui/components/ui/label";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "ana@empresa.com",
      password: "12345678",
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await login(data.email, data.password);
      void navigate("/");
    } catch (err: unknown) {
      setError("email", {
        type: "server",
        message: err instanceof Error ? err.message : "Error de autenticación",
      });
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            480:DEV PROJECTS
          </CardTitle>
          <CardDescription>Inicia sesión en tu cuenta</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email !== undefined && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password !== undefined && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
