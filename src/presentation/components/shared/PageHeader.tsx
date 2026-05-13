import React, { type ReactNode } from "react";
import { cn } from "@/presentation/ui/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode; // Para botones de acción o filtros extra
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};
