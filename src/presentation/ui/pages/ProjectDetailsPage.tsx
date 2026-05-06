import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProjectDetailsStore } from "@/infrastructure/stores/project-details.store";
import { Card, CardContent } from "@/presentation/ui/components/ui/card";
import { Button } from "@/presentation/ui/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/ui/components/ui/tabs";
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

import { ProjectHeader } from "@/presentation/ui/components/projects/ProjectHeader";
import { ProjectInfoTab } from "@/presentation/ui/components/projects/ProjectInfoTab";
import { ProjectTeamTab } from "@/presentation/ui/components/projects/ProjectTeamTab";
import { ProjectClientTab } from "@/presentation/ui/components/projects/ProjectClientTab";
import { ProjectDevelopmentsTab } from "@/presentation/ui/components/projects/ProjectDevelopmentsTab";
import { ProjectHoursTab } from "../components/projects/ProjectHoursTab";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, users, roles, allUsers, developments, clientContacts, isLoading, error, fetchProjectDetails, fetchRoles, fetchAllUsers, clearDetails } = useProjectDetailsStore();

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      fetchRoles();
      fetchAllUsers();
    }
    return () => clearDetails();
  }, [id, fetchProjectDetails, fetchRoles, fetchAllUsers, clearDetails]);

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
            <ProjectInfoTab project={project} />
          </TabsContent>

          <TabsContent value="equipo" className="space-y-6">
            <ProjectTeamTab
              users={users}
              roles={roles}
              allUsers={allUsers}
              projectId={id || ""}
            />
          </TabsContent>

          <TabsContent value="cliente" className="space-y-6">
            <ProjectClientTab
              client={project.client}
              contacts={clientContacts}
            />
          </TabsContent>

          <TabsContent value="desarrollos" className="space-y-6">
            <ProjectDevelopmentsTab developments={developments} />
          </TabsContent>

          <TabsContent value="horas" className="space-y-6">
            <ProjectHoursTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};


