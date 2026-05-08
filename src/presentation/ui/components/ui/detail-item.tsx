import React from "react";
import { cn } from "@/presentation/ui/lib/utils";

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  icon,
  iconColor = "bg-primary/10 text-primary",
  className,
}) => {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
        <div className="h-5 w-5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="font-bold text-foreground break-words">
          {value || <span className="text-muted-foreground italic font-normal">No especificado</span>}
        </div>
      </div>
    </div>
  );
};
