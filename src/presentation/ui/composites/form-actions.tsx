import React from "react";
import { Button } from "@/presentation/ui/primitives/button";
import { Save, X, Loader2 } from "lucide-react";
import { cn } from "@/presentation/ui/lib/utils";

interface FormActionsProps {
  onCancel: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSaving = false,
  saveLabel = "Guardar",
  cancelLabel = "Cancelar",
  className,
}) => {
  return (
    <div className={cn("flex gap-2 pt-4", className)}>
      <Button type="submit" disabled={isSaving} className="min-w-[120px]">
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {saveLabel}
          </>
        )}
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        onClick={onCancel} 
        disabled={isSaving}
      >
        <X className="mr-2 h-4 w-4" />
        {cancelLabel}
      </Button>
    </div>
  );
};
