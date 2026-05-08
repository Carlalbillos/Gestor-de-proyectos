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
      className={cn("shadow-sm h-8", className)} 
      onClick={onClick}
    >
      <Pencil className="mr-2 h-3.5 w-3.5" />
      {label}
    </Button>
  );
};
