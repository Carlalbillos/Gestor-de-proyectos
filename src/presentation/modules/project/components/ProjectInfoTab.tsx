import { useState } from "react";
import { Card, CardContent, DetailItem, EditButton } from "@/presentation/ui";
import type { Project } from "@/domain/entities/project.entity";
import { Info, Building2, Calendar } from "lucide-react";
import { ProjectForm } from "./ProjectForm";
import { useProjectDetailsStore } from "@/presentation/modules/project/stores/project-details.store";
import { isAdmin } from "@/domain/services/role.service";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";

interface ProjectInfoTabProps {
  project: Project;
}

export const ProjectInfoTab = ({ project }: ProjectInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { updateProject, isSaving } = useProjectDetailsStore();

  const handleSubmit = async (data: any) => {
    try {
      await updateProject(project.id, {
        ...data,
        isActive: project.isActive
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  if (isEditing) {
    return (
      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={() => setIsEditing(false)}
        isSaving={isSaving}
      />
    );
  }

  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm relative group">
      <div className="absolute top-4 right-4 z-10">
        {isAdmin(user) && (
          <EditButton onClick={() => setIsEditing(true)} label="" />
        )}

      </div>
      <CardContent className="pt-6 space-y-6">
        <DetailItem
          label="Descripción"
          value={project.description || "Sin descripción disponible para este proyecto."}
          icon={<Info className="text-primary" />}
        />

        <DetailItem
          label="Cliente"
          value={project.client?.name || "Sin cliente asignado."}
          icon={<Building2 className="text-primary" />}
        />

        <DetailItem
          label="Fecha de inicio"
          value={new Date(project.startDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          icon={<Calendar className="text-primary" />}
        />
      </CardContent>
    </Card>
  );
};
