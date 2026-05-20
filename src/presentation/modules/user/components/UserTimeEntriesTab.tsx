import { Card, CardContent, Badge } from "@/presentation/ui";
import { Clock, Calendar } from "lucide-react";
import type { TimeEntry } from "@/domain/entities/user.entity";

interface UserTimeEntriesTabProps {
  timeEntries: TimeEntry[];
}

export const UserTimeEntriesTab = ({ timeEntries }: UserTimeEntriesTabProps) => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Imputaciones de Horas</h2>
      </div>
      {timeEntries.length > 0 ? (
        timeEntries.map((entry) => (
          <Card key={entry.id} className="border-muted/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-foreground">{entry.project.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.comment}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <Badge variant="outline" className="bg-muted/50">
                    <Calendar className="mr-1.5 h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Clock className="mr-1.5 h-3 w-3" />
                    {entry.hour}h
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground italic text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          No hay imputaciones registradas.
        </p>
      )}
    </div>
  );
};
