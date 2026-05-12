import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FormInput } from "../shared/FormInput";
import { FormActions } from "../shared/form-actions";
import { X, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { adminChangePasswordSchema, type AdminChangePasswordFormData } from "../../validators/change-password.schema";

interface AdminChangePasswordModalProps {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
}

export const AdminChangePasswordModal = ({
  userName,
  isOpen,
  onClose,
  onSubmit,
}: AdminChangePasswordModalProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminChangePasswordFormData>({
    resolver: zodResolver(adminChangePasswordSchema),
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setServerError(null);
    }
  }, [isOpen, reset]);

  const onFormSubmit = async (data: AdminChangePasswordFormData) => {
    setServerError(null);
    try {
      await onSubmit(data.password);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "Error al cambiar la contraseña");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Cambiar Contraseña</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Estás cambiando la contraseña de <strong>{userName}</strong> como administrador.
          </p>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <FormInput
              id="password"
              label="Nueva Contraseña"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              registration={register("password")}
              error={errors.password?.message}
              autoFocus
            />

            <FormInput
              id="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {serverError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in zoom-in-95">
                {serverError}
              </div>
            )}

            <FormActions
              onCancel={onClose}
              isSaving={isSubmitting}
              saveLabel="Actualizar Contraseña"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
