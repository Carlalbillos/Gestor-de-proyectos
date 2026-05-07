import { Card, CardContent,} from "@/presentation/ui/components/ui/card";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectInfoTabProps {
  project: Project;
}

export const ProjectInfoTab = ({ project }: ProjectInfoTabProps) => {
  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Descripción</p>
          <p className="text-base text-foreground leading-relaxed">
            {project.description || "Sin descripción disponible para este proyecto."}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Cliente</p>
          <p className="text-base text-foreground leading-relaxed">
            {project.client?.name || "Sin cliente asignado."}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Fecha de inicio</p>
          <p className="text-base text-foreground leading-relaxed">
            {new Date(project.startDate).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
