import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProjectDetailsStore } from "@/presentation/stores/project-details.store";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import {
  Building2,
  Users,
  Code2,
  Info,
  Clock,
  Briefcase
} from "lucide-react";
import { PageLoader } from "@/presentation/components/shared/page-loader";
import { DetailError } from "@/presentation/components/shared/detail-error";

import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { ProjectInfoTab } from "@/presentation/components/projects/ProjectInfoTab";
import { ProjectTeamTab } from "@/presentation/components/projects/ProjectTeamTab";
import { ProjectClientTab } from "@/presentation/components/projects/ProjectClientTab";
import { ProjectDevelopmentsTab } from "@/presentation/components/projects/ProjectDevelopmentsTab";
import { ProjectHoursTab } from "@/presentation/components/projects/ProjectHoursTab";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    project, 
    users, 
    roles, 
    allUsers, 
    developments, 
    clientContacts, 
    isLoading, 
    error, 
    fetchProjectDetails, 
    fetchRoles, 
    fetchAllUsers, 
    fetchTechnologies,
    changeStatus,
    deleteProject,
    clearDetails 
  } = useProjectDetailsStore();
  const { user } = useAuthStore();

  const toggleConfirm = useDisclosure();
  const deleteConfirm = useDisclosure();

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      
      if (isAdmin(user)) {
        fetchRoles();
        fetchAllUsers();
        fetchTechnologies();
      }
    }
    return () => clearDetails();
  }, [id, user, fetchProjectDetails, fetchRoles, fetchAllUsers, fetchTechnologies, clearDetails]);

  const handleToggleStatus = async () => {
    if (!id) return;
    toggleConfirm.close();
    try {
      await changeStatus(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    deleteConfirm.close();
    try {
      await deleteProject(id);
      navigate("/proyectos");
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading && !project) {
    return <PageLoader variant="detail" message="Cargando detalles del proyecto..." />;
  }

  if (error) {
    return (
      <DetailError
        message={error}
        title="Error al cargar el proyecto"
        backLabel="Volver a Proyectos"
        onBack={() => navigate("/proyectos")}
      />
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <DetailsHeader
        title={project.name}
        onBack={() => navigate("/proyectos")}
        isActive={project.isActive}
        onToggleStatus={toggleConfirm.open}
        onDelete={deleteConfirm.open}
        showActions={true}
        icon={<Briefcase className="h-7 w-7 text-primary" />}
      />

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
            <ProjectHoursTab projectId={id || ""} />
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmDialog
        isOpen={toggleConfirm.isOpen}
        onClose={toggleConfirm.close}
        onConfirm={handleToggleStatus}
        title={project.isActive ? "Desactivar Proyecto" : "Activar Proyecto"}
        description={`¿Estás seguro de que deseas ${project.isActive ? "desactivar" : "activar"} el proyecto "${project.name}"?`}
        confirmText={project.isActive ? "Desactivar" : "Activar"}
        variant={project.isActive ? "destructive" : "default"}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={handleDelete}
        title="Eliminar Proyecto"
        description={`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
};


