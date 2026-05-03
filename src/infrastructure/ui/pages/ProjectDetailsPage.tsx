import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProjectDetailsStore } from "@/infrastructure/stores/project-details.store";
import { Card, CardContent } from "@/infrastructure/ui/components/ui/card";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/infrastructure/ui/components/ui/tabs";
import {
  Building2,
  Users,
  ArrowLeft,
  Loader2,
  XCircle,
  Code2,
  Info,
  Clock
} from "lucide-react";

import { ProjectHeader } from "@/infrastructure/ui/components/projects/ProjectHeader";
import { ProjectInfoTab } from "@/infrastructure/ui/components/projects/ProjectInfoTab";
import { ProjectTeamTab } from "@/infrastructure/ui/components/projects/ProjectTeamTab";
import { ProjectClientTab } from "@/infrastructure/ui/components/projects/ProjectClientTab";
import { ProjectDevelopmentsTab } from "@/infrastructure/ui/components/projects/ProjectDevelopmentsTab";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, users, developments, isLoading, error, fetchProjectDetails, clearDetails } = useProjectDetailsStore();

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchProjectDetails, clearDetails]);

  if (isLoading && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 mt-8">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Error al cargar el proyecto</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/proyectos")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <ProjectHeader project={project} onBack={() => navigate("/proyectos")} />

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="informacion" className="flex gap-2"><Info className="h-4 w-4" /> <span className="hidden sm:inline">Información</span></TabsTrigger>
          <TabsTrigger value="equipo" className="flex gap-2"><Users className="h-4 w-4" /> <span className="hidden sm:inline">Equipo</span></TabsTrigger>
          <TabsTrigger value="cliente" className="flex gap-2"><Building2 className="h-4 w-4" /> <span className="hidden sm:inline">Cliente</span></TabsTrigger>
          <TabsTrigger value="desarrollos" className="flex gap-2"><Code2 className="h-4 w-4" /> <span className="hidden sm:inline">Desarrollo</span></TabsTrigger>
          <TabsTrigger value="horas" className="flex gap-2"><Clock className="h-4 w-4" /> <span className="hidden sm:inline">Horas</span></TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="informacion" className="space-y-6">
            <ProjectInfoTab project={project} usersCount={users.length} />
          </TabsContent>

          <TabsContent value="equipo" className="space-y-6">
            <ProjectTeamTab users={users} />
          </TabsContent>

          <TabsContent value="cliente" className="space-y-6">
            <ProjectClientTab client={project.client} />
          </TabsContent>

          <TabsContent value="desarrollos" className="space-y-6">
            <ProjectDevelopmentsTab developments={developments} />
          </TabsContent>

          <TabsContent value="horas" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Imputación de Horas</h2>
            </div>
            <Card className="border-muted/60 border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">Sección en construcción</h3>
                <p className="text-muted-foreground max-w-md">
                  Aquí se mostrará el registro de horas imputadas a este proyecto por los distintos miembros del equipo. Se implementará más adelante.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};


