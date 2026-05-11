import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { useUserDetailsStore } from "@/infrastructure/stores/user-details.store";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { createTimeEntrySchema, type CreateTimeEntryFormValues } from "@/presentation/ui/validators/create-time-entry.schema";
import { Button } from "@/presentation/ui/components/ui/button";
import { Input } from "@/presentation/ui/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/presentation/ui/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ProjectHoursTabProps {
    projectId: string;
}

export const ProjectHoursTab = ({ projectId }: ProjectHoursTabProps) => {
    const { user } = useAuthStore();
    const { addTimeEntry, isLoading } = useUserDetailsStore();

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateTimeEntryFormValues>({
        resolver: zodResolver(createTimeEntrySchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            hour: "" as any,
            comment: "",
        }
    });

    const onSubmit = async (data: CreateTimeEntryFormValues) => {
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
            reset({
                date: new Date().toISOString().split('T')[0],
                hour: "" as any,
                comment: ""
            });

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Error al registrar las horas");
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Imputar Horas</CardTitle>
                <CardDescription>
                    Registra el tiempo dedicado a este proyecto.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                                {...register("hour", { valueAsNumber: true })}
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

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Registrar Horas"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};