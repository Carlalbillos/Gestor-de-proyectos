import { useState } from "react";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { EditButton } from "@/presentation/components/shared/edit-button";
import { DeleteButton } from "@/presentation/components/shared/delete-button";

interface TimeEntriesTableProps {
    entries: any[];
    mode: "project" | "user"; // "project" shows Users column, "user" shows Projects column
    onEdit?: (entry: any) => void;
    onDelete?: (entry: any) => void;
    onSave?: (entryId: string, data: { date: string, hour: number, comment: string }) => Promise<void>;
    isSaving?: boolean;
}

export const TimeEntriesTable = ({ entries, mode, onEdit, onDelete, onSave, isSaving }: TimeEntriesTableProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ date: string, hour: string, comment: string }>({
        date: "",
        hour: "",
        comment: ""
    });

    if (entries.length === 0) {
        return (
            <Card className="border-dashed bg-muted/20">
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground italic">
                        {mode === "project" 
                            ? "No hay imputaciones de horas registradas en este proyecto todavía." 
                            : "No tienes imputaciones de horas recientes."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    const startEditing = (entry: any) => {
        setEditingId(entry.id);
        setEditForm({
            date: entry.date,
            hour: String(entry.hour),
            comment: entry.comment || ""
        });
        if (onEdit) onEdit(entry); // Keep existing callback if needed
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const handleSave = async (entryId: string) => {
        if (!onSave) return;
        try {
            await onSave(entryId, {
                date: editForm.date,
                hour: Number(editForm.hour),
                comment: editForm.comment
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error saving inline edit", error);
        }
    };

    return (
        <Card className="border-muted/60 shadow-sm mt-4 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 font-medium w-[150px]">Fecha</th>
                            {mode === "project" ? (
                                <th className="px-4 py-3 font-medium">Usuario</th>
                            ) : (
                                <th className="px-4 py-3 font-medium">Proyecto</th>
                            )}
                            <th className="px-4 py-3 font-medium w-[100px]">Horas</th>
                            <th className="px-4 py-3 font-medium">Comentarios</th>
                            <th className="px-4 py-3 font-medium text-right w-[120px]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {entries.map((entry) => {
                            const isEditing = editingId === entry.id;

                            return (
                                <tr key={entry.id} className={`${isEditing ? "bg-primary/5" : "hover:bg-muted/20"} transition-colors`}>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {isEditing ? (
                                            <Input 
                                                type="date" 
                                                size={1}
                                                className="h-8 text-xs" 
                                                value={editForm.date}
                                                onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                            />
                                        ) : (
                                            entry.date
                                        )}
                                    </td>
                                    
                                    {mode === "project" ? (
                                        <td className="px-4 py-2 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    aria-hidden
                                                    className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0"
                                                >
                                                    {`${entry.name?.[0] ?? ""}${entry.surname?.[0] ?? ""}`}
                                                </div>
                                                <span className="truncate max-w-[150px]">{entry.name} {entry.surname}</span>
                                            </div>
                                        </td>
                                    ) : (
                                        <td className="px-4 py-2 font-medium">
                                            {entry.project?.name || "Desconocido"}
                                        </td>
                                    )}

                                    <td className="px-4 py-2">
                                        {isEditing ? (
                                            <Input 
                                                type="number" 
                                                step="0.5"
                                                className="h-8 text-xs" 
                                                value={editForm.hour}
                                                onChange={(e) => setEditForm({...editForm, hour: e.target.value})}
                                            />
                                        ) : (
                                            <Badge variant="secondary" className="font-bold text-xs px-2 py-0">
                                                {entry.hour}h
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {isEditing ? (
                                            <Input 
                                                className="h-8 text-xs" 
                                                placeholder="Comentario..."
                                                value={editForm.comment}
                                                onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                                            />
                                        ) : (
                                            <div className="max-w-[300px] truncate" title={entry.comment || ""}>
                                                {entry.comment || <span className="italic opacity-50">Sin comentarios</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-1">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleSave(entry.id)}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={cancelEditing}
                                                        disabled={isSaving}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    {(onEdit || onSave) && (
                                                        <EditButton
                                                            label=""
                                                            onClick={() => startEditing(entry)}
                                                        />
                                                    )}
                                                    {onDelete && (
                                                    <DeleteButton
                                                        label=""
                                                        onClick={() => onDelete(entry)}
                                                    />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
