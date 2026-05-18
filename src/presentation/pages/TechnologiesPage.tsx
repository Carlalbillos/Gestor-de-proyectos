import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, Save, Cpu } from "lucide-react";
import { PageLoader } from "@/presentation/components/shared/page-loader";
import { useTechnologiesStore } from "@/presentation/stores/technologies.store";
import { technologySchema, type TechnologyFormData } from "@/presentation/schemas/technology/technologySchema";
import type { Technology } from "@/domain/entities/technology.entity";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { EditButton } from "@/presentation/components/shared/edit-button";
import { DeleteButton } from "@/presentation/components/shared/delete-button";
import { useAsync } from "@/presentation/hooks/useAsync";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";

export const TechnologiesPage = () => {
  const navigate = useNavigate();
  const {
    technologies,
    isLoading: isStoreLoading,
    fetchTechnologies,
    createTechnology,
    updateTechnology,
    deleteTechnology
  } = useTechnologiesStore();

  const [techToEdit, setTechToEdit] = useState<Technology | null>(null);
  const [techToDelete, setTechToDelete] = useState<Technology | null>(null);
  const editModal = useDisclosure();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createAsync = useAsync(createTechnology);
  const updateAsync = useAsync(updateTechnology);
  const deleteAsync = useAsync(deleteTechnology);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setError: setErrorCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: { name: "" },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setError: setErrorUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
  });

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const onCreateSubmit = async (data: TechnologyFormData): Promise<void> => {
    try {
      await createAsync.execute({ id: uuidv7(), ...data });
      resetCreate();
    } catch (error: any) {
      console.error("Error creating technology", error);
      setErrorCreate("name", { 
        type: "server", 
        message: error.message || "Error al crear la tecnología." 
      });
    }
  };

  const handleOpenEdit = (tech: Technology) => {
    setTechToEdit(tech);
    resetUpdate({ name: tech.name });
    editModal.open();
  };

  const onUpdateSubmit = async (data: TechnologyFormData) => {
    if (!techToEdit) return;
    try {
      await updateAsync.execute(techToEdit.id, { name: data.name });
      editModal.close();
      setTechToEdit(null);
    } catch (error: any) {
      console.error("Error updating technology", error);
      setErrorUpdate("name", { 
        type: "server", 
        message: error.message || "Error al actualizar la tecnología." 
      });
    }
  };

  const onConfirmDelete = async () => {
    if (!techToDelete) return;
    setDeleteError(null);
    try {
      await deleteAsync.execute(techToDelete.id);
      setTechToDelete(null);
    } catch (error: any) {
      setDeleteError("Ha ocurrido un error al intentar eliminar la tecnología. Asegúrate de que no esté en uso.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <DetailsHeader
        title="Gestionar Tecnologías"
        onBack={() => navigate(-1)}
        showActions={false}
        icon={<Cpu className="h-7 w-7 text-primary" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CREATE FORM */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmitCreate(onCreateSubmit)} noValidate>
            <Card className="shadow-sm border-muted/60 h-full">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Nueva Tecnología
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="Ej: React, Node.js, Python..."
                    aria-invalid={!!errorsCreate.name}
                    {...registerCreate("name")}
                    disabled={createAsync.isLoading}
                  />
                  {errorsCreate.name && (
                    <p className="text-sm text-destructive">{errorsCreate.name.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 border-t bg-muted/10">
                <Button type="submit" disabled={createAsync.isLoading} className="w-full">
                  {createAsync.isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Guardar</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* LIST */}
        <div className="md:col-span-2 space-y-4">
          {isStoreLoading ? (
            <PageLoader className="py-12" />
          ) : technologies.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="p-12 text-center text-muted-foreground italic">
                No hay tecnologías registradas todavía.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {technologies.map((tech) => (
                <Card key={tech.id} className="shadow-sm hover:border-primary/30 transition-colors group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{tech.name}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <EditButton label="" onClick={() => handleOpenEdit(tech)} />
                      <DeleteButton label="" onClick={() => setTechToDelete(tech)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={editModal.isOpen} onOpenChange={(open) => !open && editModal.close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tecnología</DialogTitle>
            <DialogDescription>Modifica el nombre de la tecnología y guarda los cambios.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate(onUpdateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-name">Nombre</Label>
                <Input
                  id="update-name"
                  {...registerUpdate("name")}
                  disabled={updateAsync.isLoading}
                  className={errorsUpdate.name ? "border-destructive" : ""}
                />
                {errorsUpdate.name && (
                  <p className="text-sm text-destructive">{errorsUpdate.name.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={editModal.close} disabled={updateAsync.isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateAsync.isLoading}>
                {updateAsync.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!techToDelete}
        onClose={() => {
          setTechToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={onConfirmDelete}
        title="¿Eliminar tecnología?"
        description={deleteError || `Esta acción eliminará la tecnología "${techToDelete?.name}". Asegúrate de que ningún proyecto dependa de ella.`}
        confirmText="Sí, eliminar"
        isLoading={deleteAsync.isLoading}
        variant="destructive"
      />
    </div>
  );
};
