import React, { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/presentation/ui/primitives/card";
import { cn } from "@/presentation/ui/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) => {
  return (
    <Card className={cn("border-dashed border-2 bg-muted/5 shadow-none", className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
        {action && (
          <div className="animate-in fade-in zoom-in duration-300">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
