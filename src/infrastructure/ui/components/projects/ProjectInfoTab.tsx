import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Building2, Calendar, Users } from "lucide-react";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectInfoTabProps {
  project: Project;
  usersCount: number;
}

export const ProjectInfoTab = ({ project, usersCount }: ProjectInfoTabProps) => {
  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Información General
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Descripción</p>
          <p className="text-base text-foreground leading-relaxed">
            {project.description || "Sin descripción disponible para este proyecto."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Cliente</p>
              <p className="font-bold text-foreground">
                {project.client?.name || "No asignado"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Fecha de Inicio</p>
              <p className="font-bold text-foreground">
                {new Date(project.start_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Equipo</p>
              <p className="font-bold text-foreground">{usersCount} miembros</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
