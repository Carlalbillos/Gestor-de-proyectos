import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/presentation/ui/lib/utils";
import { Check, X } from "lucide-react";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  isActive, 
  activeText = "Activo", 
  inactiveText = "Inactivo",
  className,
  showIcon = true
}) => {
  return (
    <Badge 
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-0.5 font-bold transition-all shadow-sm",
        isActive 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" 
          : "bg-slate-50 text-slate-600 border-slate-200/60",
        className
      )}
    >
      {showIcon && (
        isActive 
          ? <Check className="h-3 w-3 stroke-[3]" /> 
          : <X className="h-3 w-3 stroke-[3]" />
      )}
      {isActive ? activeText : inactiveText}
    </Badge>
  );
};
