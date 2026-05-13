import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/presentation/stores/auth.store";
import { loginSchema } from "@/presentation/schemas/auth/loginSchema";
import type { LoginFormData } from "@/presentation/schemas/auth/loginSchema";

import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { FormInput } from "@/presentation/components/shared/FormInput";

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
            <img src="/logo480-t.png" alt="Logo 480:DEV PROJECTS" />
          </CardTitle>
          <CardDescription className="text-lg font-bold mt-5">Gestor de proyectos 480:DEV</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="tu@email.com"
              registration={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Tu contraseña"
              registration={register("password")}
              error={errors.password?.message}
            />

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
