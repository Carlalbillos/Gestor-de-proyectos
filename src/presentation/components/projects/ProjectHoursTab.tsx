import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useUserDetailsStore } from "@/presentation/stores/user-details.store";
import { useProjectDetailsStore } from "@/presentation/stores/project-details.store";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import * as z from "zod";
import { createTimeEntrySchema, type CreateTimeEntryFormValues } from "@/presentation/schemas/user/createTimeEntrySchema";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { TimeEntriesTable } from "@/presentation/components/shared/TimeEntriesTable";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { Loader2, CheckCircle2, Clock, X } from "lucide-react";
import { isAdmin } from "@/domain/services/role.service";

interface ProjectHoursTabProps {
    projectId: string;
}

export const ProjectHoursTab = ({ projectId }: ProjectHoursTabProps) => {
    const { user } = useAuthStore();
    const { addTimeEntry, isLoading: isSavingUserDetail } = useUserDetailsStore();
    const { timeEntries, users: projectUsers, fetchProjectTimeEntries, updateTimeEntry, deleteTimeEntry, isSaving: isSavingProjectStore } = useProjectDetailsStore();

    // Resolve the current user's display name from the project team list
    const currentMember = projectUsers.find(pu => pu.appUserId === user?.id);

    const isLoading = isSavingUserDetail || isSavingProjectStore;

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [entryToDelete, setEntryToDelete] = useState<any | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.input<typeof createTimeEntrySchema>>({
        resolver: zodResolver(createTimeEntrySchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            hour: "",
            comment: "",
        }
    });

    const [isAdding, setIsAdding] = useState(false);

    const handleDelete = async () => {
        if (!entryToDelete) return;
        try {
            await deleteTimeEntry(projectId, entryToDelete.id);
            setEntryToDelete(null);
        } catch (err: any) {
            setError(err.message || "Error al eliminar las horas");
        }
    };

    const onSubmit = async (formData: any) => {
        const data = formData as CreateTimeEntryFormValues;
        if (!user) return;

        setError(null);
        setSuccess(false);

        try {
            await addTimeEntry(user.id, {
                id: uuidv7(),
                project_id: projectId,
                date: data.date,
                hour: data.hour,
                comment: data.comment
            });
            setSuccess(true);
            await fetchProjectTimeEntries(projectId);

            reset({
                date: new Date().toISOString().split('T')[0],
                hour: "",
                comment: ""
            });

            setTimeout(() => {
                setSuccess(false);
                setIsAdding(false);
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Error al registrar las horas");
        }
    };

    const totalHours = timeEntries.reduce((acc, curr) => acc + curr.hour, 0);

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Total imputado: <span className="text-foreground font-bold">{totalHours}h en {timeEntries.length} imputaciones</span></span>
                </div>
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                        reset({
                            date: new Date().toISOString().split('T')[0],
                            hour: "",
                            comment: ""
                        });
                        setIsAdding(true);
                    }}
                    disabled={isAdding}
                >
                    <Clock className="h-4 w-4" />
                    Registrar Horas
                </Button>
            </div>

            {isAdding && (
                <Card className="border-primary/50 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" /> Nueva Imputación
                            </h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                setIsAdding(false);
                            }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2 border border-green-200">
                                <CheckCircle2 className="h-5 w-5" />
                                <p>Horas imputadas correctamente</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="date" className="text-sm font-medium">Fecha</label>
                                    <Input
                                        id="date"
                                        type="date"
                                        {...register("date")}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-destructive">{errors.date.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="hour" className="text-sm font-medium">Horas invertidas</label>
                                    <Input
                                        id="hour"
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        placeholder="Ej: 4.5"
                                        {...register("hour")}
                                    />
                                    {errors.hour && (
                                        <p className="text-sm text-destructive">{errors.hour.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="comment" className="text-sm font-medium">Comentarios / Tareas realizadas</label>
                                <textarea
                                    id="comment"
                                    placeholder="Describe en qué has trabajado..."
                                    {...register("comment")}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.comment && (
                                    <p className="text-sm text-destructive">{errors.comment.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => {
                                    setIsAdding(false);
                                }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        "Registrar Horas"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <TimeEntriesTable
                entries={timeEntries}
                mode="project"
                onSave={(entryId, data) => updateTimeEntry(projectId, entryId, data)}
                onDelete={setEntryToDelete}
                isSaving={isLoading}
                canEditEntry={(entry) =>
                    isAdmin(user) || (!!currentMember && entry.name === currentMember.name && entry.surname === currentMember.surname)
                }
            />

            <ConfirmDialog
                isOpen={!!entryToDelete}
                title="Eliminar imputación"
                description={`¿Estás seguro de que deseas eliminar la imputación de ${entryToDelete?.hour}h del día ${entryToDelete?.date}?`}
                onConfirm={handleDelete}
                onClose={() => setEntryToDelete(null)}
                isLoading={isLoading}
                variant="destructive"
                confirmText="Eliminar"
            />
        </div>
    );
};