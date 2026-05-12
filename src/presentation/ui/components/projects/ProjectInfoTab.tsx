import { Card, CardContent } from "@/presentation/ui/components/ui/card";
import type { Project } from "@/domain/entities/project.entity";
import { DetailItem } from "@/presentation/ui/components/shared/detail-item";
import { Info, Building2, Calendar } from "lucide-react";

interface ProjectInfoTabProps {
  project: Project;
}

export const ProjectInfoTab = ({ project }: ProjectInfoTabProps) => {
  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardContent className="pt-6 space-y-6">
        <DetailItem
          label="Descripción"
          value={project.description || "Sin descripción disponible para este proyecto."}
          icon={<Info />}
        />

        <DetailItem
          label="Cliente"
          value={project.client?.name || "Sin cliente asignado."}
          icon={<Building2 />}
        />

        <DetailItem
          label="Fecha de inicio"
          value={new Date(project.startDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          icon={<Calendar />}
        />
      </CardContent>
    </Card>
  );
};
