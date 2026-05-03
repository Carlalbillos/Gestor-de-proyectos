import { Button } from "@/infrastructure/ui/components/ui/button";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
}

export const ProjectHeader = ({ project, onBack }: ProjectHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight">{project.name}</h1>
            <Badge
              variant={project.is_active ? "default" : "secondary"}
              className={project.is_active ? "bg-green-500/10 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}
            >
              {project.is_active ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Activo
                </div>
              ) : "Inactivo"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
