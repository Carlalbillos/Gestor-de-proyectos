import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Building2, Briefcase } from "lucide-react";
import type { ProjectClient } from "@/domain/entities/project.entity";

interface ProjectClientTabProps {
  client?: ProjectClient | null;
}

export const ProjectClientTab = ({ client }: ProjectClientTabProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Información del Cliente</h2>
      </div>
      
      {client ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Comercial</p>
                <p className="text-lg font-bold">{client.name}</p>
              </div>
              {/* Placeholder for future web entity */}
              <div className="p-4 rounded-md bg-muted/30 border border-dashed text-sm text-muted-foreground">
                <p>La web y más detalles del cliente se mostrarán aquí cuando la entidad esté completa.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle>Contactos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for future contacts entity */}
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center border rounded-md border-dashed bg-muted/10">
                <Briefcase className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">El listado de contactos se implementará más adelante.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted">
          Este proyecto no tiene un cliente asignado.
        </p>
      )}
    </>
  );
};
