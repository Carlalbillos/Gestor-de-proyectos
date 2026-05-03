import { Card, CardContent } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Users } from "lucide-react";
import type { ProjectUser } from "@/domain/entities/project.entity";

interface ProjectTeamTabProps {
  users: ProjectUser[];
}

export const ProjectTeamTab = ({ users }: ProjectTeamTabProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Equipo del Proyecto</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <Card key={user.app_user_id} className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {user.name.charAt(0)}{user.surname.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-foreground truncate">{user.name} {user.surname}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] h-5 bg-background">
                    {user.role?.name || "Colaborador"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted col-span-full">
            No hay miembros asignados a este equipo todavía.
          </p>
        )}
      </div>
    </>
  );
};
