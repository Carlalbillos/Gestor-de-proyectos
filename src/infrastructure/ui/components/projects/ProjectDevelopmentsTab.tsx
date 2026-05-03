import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Code2, ExternalLink } from "lucide-react";
import type { ProjectDevelopment } from "@/domain/entities/project.entity";

interface ProjectDevelopmentsTabProps {
  developments: ProjectDevelopment[];
}

export const ProjectDevelopmentsTab = ({ developments }: ProjectDevelopmentsTabProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Desarrollos y Entornos</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {developments.length > 0 ? (
          developments.map((dev) => (
            <Card key={dev.id} className="border-muted/60 shadow-sm overflow-hidden flex flex-col h-full">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{dev.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{dev.description}</CardDescription>
                  </div>
                  {dev.technology && (
                    <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 whitespace-nowrap ml-2">
                      {dev.technology.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-grow flex flex-col justify-end">
                <div className="flex flex-wrap gap-2 mt-auto">
                  {dev.url_repository && (
                    <Button variant="outline" size="sm" asChild className="h-8">
                      <a href={dev.url_repository} target="_blank" rel="noopener noreferrer">
                        <Code2 className="mr-2 h-3.5 w-3.5" />
                        Repositorio
                      </a>
                    </Button>
                  )}
                  {dev.links.map((link) => (
                    <Button key={link.id} variant="secondary" size="sm" asChild className="h-8">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        {link.environment}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted col-span-full">
            No se han registrado desarrollos para este proyecto.
          </p>
        )}
      </div>
    </>
  );
};
