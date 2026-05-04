import type { ProjectUser } from "@/domain/entities/project.entity";
import { Card, CardContent } from "../ui/card";

export const ProjectTeamTab = ({ users }: { users: ProjectUser[] }) => {
  const usersCount = users.length;

  return (
    <div className="grid gap-4">
      <div className="text-sm text-muted-foreground">
        {usersCount} {usersCount === 1 ? "miembro" : "miembros"} asignados
      </div>

      {usersCount > 0 ? (
        users.map(user => (
          <Card key={user.app_user_id} className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50">
            <CardContent className="p-2 flex items-center gap-4">
              <div
                aria-hidden
                className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg"
              >
                {`${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate">
                  {user.name} {user.surname}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.role?.name || "Colaborador"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="col-span-full text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted">
          No hay miembros asignados a este equipo todavía.
        </p>
      )}
    </div>
  );
};