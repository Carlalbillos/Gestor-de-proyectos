import React from "react";
import { Button } from "@/presentation/ui/primitives/button";
import { Badge } from "@/presentation/ui/primitives/badge";
import { ArrowLeft, Power, Trash2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";

interface DetailsHeaderProps {
  title: string;
  subTitle?: React.ReactNode;
  onBack: () => void;
  isActive?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  icon?: React.ReactNode;
  isToggling?: boolean;
  showActions?: boolean;
}
export const DetailsHeader: React.FC<DetailsHeaderProps> = ({
  title,
  subTitle,
  onBack,
  isActive,
  onToggleStatus,
  onDelete,
  icon,
  isToggling = false,
  showActions = true,
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div className="space-y-2 w-full">
        <Button
          variant="ghost"
          size="sm"
          className="pl-0 text-muted-foreground hover:text-primary transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Button>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
              <div className="flex items-center gap-2 mt-1">
                {isActive !== undefined && (
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Activo" : "Desactivado"}
                  </Badge>
                )}
                {subTitle}
              </div>
            </div>
          </div>
          {(showActions && isAdmin(user)) && (
            <div className="flex items-center gap-2">
              {onToggleStatus && (
                <Button
                  variant={isActive ? "destructive" : "outline"}
                  size="sm"
                  className="shadow-sm"
                  onClick={onToggleStatus}
                  disabled={isToggling}
                >
                  {isToggling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="mr-2 h-4 w-4" />
                  )}
                  {isActive ? "Desactivar" : "Activar"}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="shadow-sm"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
