import { useNavigate } from "react-router";
import { Card, CardContent, Badge } from "@/presentation/ui";
import { Briefcase } from "lucide-react";

interface ClientProjectsTabProps {
  projects: any[]; // Use proper type if available
}

export const ClientProjectsTab = ({ projects }: ClientProjectsTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Proyectos Activos</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card
              key={project.id}
              className="group border-muted/50 hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card cursor-pointer overflow-hidden"
              onClick={() => navigate(`/proyectos/${project.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</p>
                  <Badge variant={project.isActive ? "default" : "secondary"}>
                    {project.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {project.description || "Sin descripción disponible."}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground italic col-span-full text-center py-8 bg-muted/20 rounded-lg border border-dashed">
            No hay proyectos asociados.
          </p>
        )}
      </div>
    </div>
  );
};
