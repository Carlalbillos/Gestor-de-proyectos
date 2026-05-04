import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Label } from "@/infrastructure/ui/components/ui/label";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { userChangePasswordSchema, type UserChangePasswordFormData } from "@/infrastructure/ui/validators/change-password.schema";
import { useState } from "react";

export const SettingsPage = () => {
  const { user, changePassword } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserChangePasswordFormData>({
    resolver: zodResolver(userChangePasswordSchema),
  });

  const onFormSubmit = async (data: UserChangePasswordFormData) => {
    setSuccessMessage(null);
    setServerError(null);
    try {
      await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      setSuccessMessage("Contraseña actualizada correctamente");
      reset();
    } catch (err: any) {
      setServerError(err.message || "Error al cambiar la contraseña");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-muted/60 shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Cambiar Contraseña</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-9 ${errors.currentPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("currentPassword")}
                    />
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm font-medium text-destructive">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-9 ${errors.newPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("newPassword")}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm font-medium text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-9 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in zoom-in-95">
                    {serverError}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-md bg-green-500/10 border border-green-200 text-green-700 text-sm font-medium animate-in fade-in zoom-in-95">
                    {successMessage}
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full sm:w-auto min-w-[150px]" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
