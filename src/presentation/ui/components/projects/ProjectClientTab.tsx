import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/components/ui/card";
import type { ProjectClient } from "@/domain/entities/project.entity";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectClientTabProps {
  client?: ProjectClient | null;
}

export const ProjectClientTab = ({ client }: ProjectClientTabProps) => {
  const navigate = useNavigate();

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
              <Button variant="outline" size="sm" className="h-8" onClick={() => navigate(`/clientes/${client.id}`)}>
                Ficha de cliente
              </Button>
            </CardContent>
          </Card>

          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle>Contactos</CardTitle>
            </CardHeader>
            <CardContent>

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
