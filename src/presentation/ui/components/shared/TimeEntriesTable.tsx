import { Card, CardContent } from "@/presentation/ui/components/ui/card";
import { Badge } from "@/presentation/ui/components/ui/badge";
import type { ProjectTimeEntry } from "@/domain/entities/project.entity";
import type { TimeEntry } from "@/domain/entities/user.entity";



interface TimeEntriesTableProps {
    entries: any[];
    mode: "project" | "user"; // "project" shows Users column, "user" shows Projects column
}

export const TimeEntriesTable = ({ entries, mode }: TimeEntriesTableProps) => {
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

    return (
        <Card className="border-muted/60 shadow-sm mt-4 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 font-medium">Fecha</th>
                            {mode === "project" ? (
                                <th className="px-4 py-3 font-medium">Usuario</th>
                            ) : (
                                <th className="px-4 py-3 font-medium">Proyecto</th>
                            )}
                            <th className="px-4 py-3 font-medium">Horas</th>
                            <th className="px-4 py-3 font-medium">Comentarios</th>
                            <th className="px-4 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">{entry.date}</td>
                                
                                {mode === "project" ? (
                                    <td className="px-4 py-3 font-medium">
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
                                    <td className="px-4 py-3 font-medium">
                                        {entry.project?.name || "Desconocido"}
                                    </td>
                                )}

                                <td className="px-4 py-3">
                                    <Badge variant="secondary" className="font-bold text-xs px-2 py-0">
                                        {entry.hour}h
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate" title={entry.comment || ""}>
                                    {entry.comment || <span className="italic opacity-50">Sin comentarios</span>}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {/* TODO: Acciones */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
