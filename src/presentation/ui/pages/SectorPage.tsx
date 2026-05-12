import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/presentation/ui/components/ui/card";
import { Input } from "@/presentation/ui/components/ui/input";
import { Label } from "@/presentation/ui/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useSectorsStore } from "@/infrastructure/stores/sectors.store";
import { createSectorSchema } from "@/presentation/ui/validators/create-sector.schema";
import type { CreateSectorFormData } from "@/presentation/ui/validators/create-sector.schema";
import type { Sector } from "@/domain/entities/sector.entity";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { EditButton } from "@/presentation/ui/components/shared/edit-button";
import { DeleteButton } from "@/presentation/ui/components/shared/delete-button";
import { useAsync } from "@/presentation/hooks/useAsync";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/components/ui/dialog";

import { DetailsHeader } from "@/presentation/ui/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/ui/components/shared/confirm-dialog";

export const SectorPage = () => {
  const navigate = useNavigate();
  const {
    sectors,
    isLoading: isStoreLoading,
    fetchSectors,
    createSector,
    updateSector,
    deleteSector
  } = useSectorsStore();

  const [sectorToEdit, setSectorToEdit] = useState<Sector | null>(null);
  const [sectorToDelete, setSectorToDelete] = useState<Sector | null>(null);
  const editModal = useDisclosure();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createAsync = useAsync(createSector);
  const updateAsync = useAsync(updateSector);
  const deleteAsync = useAsync(deleteSector);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setError: setErrorCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateSectorFormData>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: { name: "" },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setError: setErrorUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<CreateSectorFormData>({
    resolver: zodResolver(createSectorSchema),
  });

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const onCreateSubmit = async (data: CreateSectorFormData): Promise<void> => {
    try {
      await createAsync.execute({ id: uuidv7(), ...data });
      resetCreate();
    } catch (error: any) {
      console.error("Error creating sector", error);
      const status = error?.response?.status;
      let message = "Error al crear el sector. Revisa los datos e inténtalo de nuevo.";
      if (status === 409) message = "Ya existe un sector con ese nombre.";
      setErrorCreate("name", { type: "server", message });
    }
  };

  const handleOpenEdit = (sector: Sector) => {
    setSectorToEdit(sector);
    resetUpdate({ name: sector.name });
    editModal.open();
  };

  const onUpdateSubmit = async (data: CreateSectorFormData) => {
    if (!sectorToEdit) return;
    try {
      await updateAsync.execute(sectorToEdit.id, { name: data.name });
      editModal.close();
      setSectorToEdit(null);
    } catch (error: any) {
      console.error("Error updating sector", error);
      const status = error?.response?.status;
      let message = "Error al actualizar el sector.";
      if (status === 409) message = "Ya existe un sector con ese nombre.";
      setErrorUpdate("name", { type: "server", message });
    }
  };

  const onConfirmDelete = async () => {
    if (!sectorToDelete) return;
    setDeleteError(null);
    try {
      await deleteAsync.execute(sectorToDelete.id);
      setSectorToDelete(null);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setDeleteError("No puedes eliminar el sector si tiene clientes relacionados.");
      } else {
        setDeleteError("Ha ocurrido un error al intentar eliminar el sector.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <DetailsHeader
        title="Gestionar Sectores"
        onBack={() => navigate("/clientes")}
        showActions={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CREATE SECTOR FORM */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmitCreate(onCreateSubmit)} noValidate>
            <Card className="shadow-sm border-muted/60">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Nuevo Sector
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Sector</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Tecnología"
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
                    <><Save className="mr-2 h-4 w-4" /> Crear Sector</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* LIST OF SECTORS */}
        <div className="md:col-span-2 space-y-4">
          {isStoreLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
          ) : sectors.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="p-12 text-center text-muted-foreground italic">
                No hay sectores registrados todavía.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {sectors.map((sector) => (
                <Card key={sector.id} className="shadow-sm hover:border-primary/30 transition-colors group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{sector.name}</span>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <EditButton label="" onClick={() => handleOpenEdit(sector)} />
                      <DeleteButton label="" onClick={() => setSectorToDelete(sector)} />
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
            <DialogTitle>Editar Sector</DialogTitle>
            <DialogDescription>Modifica el nombre del sector y guarda los cambios.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate(onUpdateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-name">Nombre del Sector</Label>
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
        isOpen={!!sectorToDelete}
        onClose={() => {
          setSectorToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={onConfirmDelete}
        title="¿Eliminar sector?"
        description={deleteError || `Esta acción eliminará el sector "${sectorToDelete?.name}". Asegúrate de que ningún cliente dependa de él.`}
        confirmText="Sí, eliminar"
        isLoading={deleteAsync.isLoading}
        variant="destructive"
      />
    </div>
  );
};
