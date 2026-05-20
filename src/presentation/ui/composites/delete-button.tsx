import React from "react";
import { Button } from "@/presentation/ui/primitives/button";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/presentation/ui/lib/utils";

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
  isLoading?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  className,
  label = "Eliminar",
  isLoading = false
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn(
        "h-8 px-3 text-xs font-medium border-destructive/20 bg-background text-destructive/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200 shadow-sm",
        !label && "w-8 px-0 h-8",
        className
      )} 
      onClick={onClick}
      disabled={isLoading}
      title={!label ? "Eliminar" : undefined}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <>
          <Trash2 className={cn("h-3.5 w-3.5", label && "mr-2")} />
          {label}
        </>
      )}
    </Button>
  );
};
