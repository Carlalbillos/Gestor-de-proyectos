import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/presentation/ui/components/ui/card";
import { Input } from "@/presentation/ui/components/ui/input";
import { Label } from "@/presentation/ui/components/ui/label";
import { ChevronLeft, Loader2, Save, Pencil, Trash2 } from "lucide-react";
import { ApiSectorRepository } from "@/infrastructure/adapters/ApiSectorRepository";
import { SectorService } from "@/application/services/SectorService";
import { createSectorSchema } from "@/presentation/ui/validators/create-sector.schema";
import type { CreateSectorFormData } from "@/presentation/ui/validators/create-sector.schema";
import type { Sector } from "@/domain/entities/sector.entity";
import { uuidv7 } from "@/presentation/ui/lib/uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/ui/components/ui/alert-dialog";

const sectorRepository = new ApiSectorRepository();
const sectorService = new SectorService(sectorRepository);

export const SectorPage = () => {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [sectorToEdit, setSectorToEdit] = useState<Sector | null>(null);
  const [sectorToDelete, setSectorToDelete] = useState<Sector | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    loadSectors();
  }, []);

  const loadSectors = async () => {
    setIsFetching(true);
    try {
      const data = await sectorService.getSectors();
      setSectors(data);
    } catch (error) {
      console.error("Error loading sectors", error);
    } finally {
      setIsFetching(false);
    }
  };

  const onCreateSubmit = async (data: CreateSectorFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const newSector = { id: uuidv7(), ...data };
      await sectorService.createSector(newSector);
      resetCreate();
      await loadSectors();
    } catch (error: any) {
      console.error("Error creating sector", error);
      const status = error?.response?.status;
      let message = "Error al crear el sector. Revisa los datos e inténtalo de nuevo.";
      if (status === 409) message = "Ya existe un sector con ese nombre.";
      setErrorCreate("name", { type: "server", message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (sector: Sector) => {
    setSectorToEdit(sector);
    resetUpdate({ name: sector.name });
  };

  const onUpdateSubmit = async (data: CreateSectorFormData) => {
    if (!sectorToEdit) return;
    setIsUpdating(true);
    try {
      await sectorService.updateSector(sectorToEdit.id, { name: data.name });
      setSectorToEdit(null);
      await loadSectors();
    } catch (error: any) {
      console.error("Error updating sector", error);
      const status = error?.response?.status;
      let message = "Error al actualizar el sector.";
      if (status === 409) message = "Ya existe un sector con ese nombre.";
      setErrorUpdate("name", { type: "server", message });
    } finally {
      setIsUpdating(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!sectorToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await sectorService.deleteSector(sectorToDelete.id);
      setSectorToDelete(null);
      await loadSectors();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setDeleteError("No puedes eliminar el sector si tiene clientes relacionados.");
      } else {
        setDeleteError("Ha ocurrido un error al intentar eliminar el sector.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/clientes")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestionar Sectores</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CREATE SECTOR FORM */}
        <div className="md:col-span-1 sticky top-2 h-fit">
          <form onSubmit={handleSubmitCreate(onCreateSubmit)} noValidate>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Nuevo Sector</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Sector</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Tecnología"
                    aria-invalid={!!errorsCreate.name}
                    {...registerCreate("name")}
                    disabled={isLoading}
                  />
                  {errorsCreate.name && (
                    <p className="text-sm text-destructive">{errorsCreate.name.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 bg-muted/20 border-t">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
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
          {isFetching ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sectors.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center text-muted-foreground">
                No hay sectores registrados todavía.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {sectors.map((sector) => (
                <Card key={sector.id} className="shadow-sm hover:border-primary/50 transition-colors">
                  <CardContent className="px-4  flex items-center justify-between">
                    <span className="font-medium">{sector.name.charAt(0) + sector.name.slice(1).toLowerCase()}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(sector)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setSectorToDelete(sector)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={!!sectorToEdit} onOpenChange={(open) => !open && setSectorToEdit(null)}>
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
                  disabled={isUpdating}
                  className={errorsUpdate.name ? "border-destructive" : ""}
                />
                {errorsUpdate.name && (
                  <p className="text-sm text-destructive">{errorsUpdate.name.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSectorToEdit(null)} disabled={isUpdating}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <AlertDialog open={!!sectorToDelete} onOpenChange={(open) => {
        if (!open) {
          setSectorToDelete(null);
          setDeleteError(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar el sector?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el sector "{sectorToDelete?.name}".
              Asegúrate de que ningún cliente dependa de este sector.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="bg-destructive/15 text-destructive text-sm font-medium p-3 rounded-md my-2">
              {deleteError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
