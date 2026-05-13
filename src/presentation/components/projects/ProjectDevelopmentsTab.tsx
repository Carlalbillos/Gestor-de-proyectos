import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/presentation/components/ui/dialog";
import { Code2, ExternalLink, Plus } from "lucide-react";
import type { ProjectDevelopment } from "@/domain/entities/project.entity";
import { useProjectDetailsStore } from "@/presentation/stores/project-details.store";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { ProjectDevelopmentForm } from "./ProjectDevelopmentForm";
import { ConfirmDialog } from "../shared/confirm-dialog";
import { EditButton } from "../shared/edit-button";
import { DeleteButton } from "../shared/delete-button";
import { uuidv7 } from "@/presentation/ui/lib/uuid";

interface ProjectDevelopmentsTabProps {
  developments: ProjectDevelopment[];
}

export const ProjectDevelopmentsTab = ({ developments }: ProjectDevelopmentsTabProps) => {
  const {
    project,
    technologies,
    isSaving,
    addDevelopment,
    updateDevelopment,
    deleteDevelopment
  } = useProjectDetailsStore();

  const formModal = useDisclosure();
  const deleteConfirm = useDisclosure();

  const [selectedDev, setSelectedDev] = useState<ProjectDevelopment | undefined>(undefined);
  const [devToDelete, setDevToDelete] = useState<ProjectDevelopment | null>(null);

  const handleAdd = () => {
    setSelectedDev(undefined);
    formModal.open();
  };

  const handleEdit = (dev: ProjectDevelopment) => {
    setSelectedDev(dev);
    formModal.open();
  };

  const handleDeleteClick = (dev: ProjectDevelopment) => {
    setDevToDelete(dev);
    deleteConfirm.open();
  };

  const handleSubmit = async (data: any) => {
    if (!project) return;

    try {
      if (selectedDev) {
        await updateDevelopment(project.id, {
          id: selectedDev.id,
          ...data,
        });
      } else {
        await addDevelopment(project.id, {
          id: uuidv7(),
          ...data,
        });
      }
      formModal.close();
    } catch (error) {
      console.error("Error saving development", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!project || !devToDelete) return;
    try {
      await deleteDevelopment(project.id, devToDelete.id);
      deleteConfirm.close();
      setDevToDelete(null);
    } catch (error) {
      console.error("Error deleting development", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Desarrollos del Proyecto
        </h3>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Desarrollo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {developments.length > 0 ? (
          developments.map((dev) => (
            <Card key={dev.id} className="border-muted/60 shadow-sm overflow-hidden flex flex-col h-full hover:border-primary/30 transition-all">
              <CardHeader className="pb-3 border-b bg-muted/5 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-base font-bold text-foreground truncate">{dev.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2 text-xs">{dev.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {dev.technology && (
                      <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 whitespace-nowrap text-[10px] py-0">
                        {dev.technology.name}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <EditButton onClick={() => handleEdit(dev)} label="" />
                      <DeleteButton onClick={() => handleDeleteClick(dev)} label="" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-grow flex flex-col justify-end bg-card">
                <div className="flex flex-wrap gap-2 mt-auto">
                  {dev.urlRepository && (
                    <Button variant="outline" size="sm" asChild className="h-7 text-xs">
                      <a href={dev.urlRepository} target="_blank" rel="noopener noreferrer">
                        <Code2 className="mr-2 h-3 w-3" />
                        Repo
                      </a>
                    </Button>
                  )}
                  {dev.links.map((link) => (
                    <Button key={link.id} variant="secondary" size="sm" asChild className="h-7 text-xs">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        {link.environment}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/10">
            <Code2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No hay desarrollos registrados.</p>
            <Button variant="link" onClick={handleAdd} className="mt-1">
              Registrar el primero
            </Button>
          </div>
        )}
      </div>

      <Dialog open={formModal.isOpen} onOpenChange={(open) => !open && formModal.close()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDev ? "Editar Desarrollo" : "Nuevo Desarrollo"}</DialogTitle>
            <DialogDescription>
              Completa la información técnica del desarrollo asociado al proyecto.
            </DialogDescription>
          </DialogHeader>
          <ProjectDevelopmentForm
            initialData={selectedDev}
            technologies={technologies}
            onSubmit={handleSubmit}
            onCancel={formModal.close}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={handleConfirmDelete}
        title="Eliminar Desarrollo"
        description={`¿Estás seguro de que deseas eliminar "${devToDelete?.name}"? Esta acción borrará también todos los enlaces asociados.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={isSaving}
      />
    </>
  );
};
