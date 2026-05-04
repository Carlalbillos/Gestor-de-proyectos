import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Briefcase } from "lucide-react";
import type { ProjectClient } from "@/domain/entities/project.entity";
import { Button } from "../ui/button";

interface ProjectClientTabProps {
  client?: ProjectClient | null;
}

export const ProjectClientTab = ({ client }: ProjectClientTabProps) => {
  return (
    <>
      {client ? (
        <div className="grid gap-6">
          <Card className="border-muted/60 shadow-sm">
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cliente:
                </p>
                <p className="text-lg font-bold">{client.name}</p>
              </div>
              <Button variant="outline" size="sm" asChild className="h-8">
                <a href={`/clientes/${client.id}`} target="_blank" rel="noopener noreferrer">
                  Ficha de cliente
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle>Contactos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-2 px-2 text-center border rounded-md border-dashed bg-muted/10">
                <Briefcase
                  aria-hidden
                  className="h-8 w-8 text-muted-foreground/50 mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  El listado de contactos se implementará más adelante.
                </p>
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
