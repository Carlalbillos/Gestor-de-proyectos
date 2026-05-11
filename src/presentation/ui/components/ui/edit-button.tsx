import React from "react";
import { Button } from "./button";
import { Pencil } from "lucide-react";
import { cn } from "@/presentation/ui/lib/utils";

interface EditButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  className,
  label = "Editar"
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-8 px-3 text-xs font-medium border-primary/20 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 shadow-sm",
        !label && "w-8 px-0 h-8",
        className
      )}
      onClick={onClick}
      title={!label ? "Editar" : undefined}
    >
      <Pencil className={cn("h-3.5 w-3.5", label && "mr-2")} />
      {label}
    </Button>
  );
};
