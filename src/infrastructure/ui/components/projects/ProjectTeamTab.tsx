import { useState } from "react";
import type { ProjectUser, ProjectRole } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus, Edit2, Trash2, Loader2, X, Check } from "lucide-react";
import { useProjectDetailsStore } from "@/infrastructure/stores/project-details.store";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

interface ProjectTeamTabProps {
  users: ProjectUser[];
  roles: ProjectRole[];
  allUsers: User[];
  projectId: string;
}

export const ProjectTeamTab = ({ users, roles, allUsers, projectId }: ProjectTeamTabProps) => {
  const usersCount = users.length;
  const { removeUser, updateUserRole, assignUser } = useProjectDetailsStore();
  const [isManaging, setIsManaging] = useState(false);
  const [editingUser, setEditingUser] = useState<ProjectUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtrar usuarios que ya están en el proyecto
  const availableUsers = allUsers.filter(
    u => !users.some(pu => pu.appUserId === u.id)
  );

  const resetForm = () => {
    setIsManaging(false);
    setEditingUser(null);
    setSelectedUserId("");
    setSelectedRoleId("");
  };

  const handleAssign = async () => {
    if (!selectedUserId || !selectedRoleId) return;
    setFormLoading(true);
    try {
      await assignUser(projectId, selectedUserId, selectedRoleId);
      resetForm();
    } catch (e) {
      console.error("Error assigning user:", e);
      alert("Error al asignar usuario");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !selectedRoleId) return;
    setFormLoading(true);
    try {
      await updateUserRole(projectId, editingUser.appUserId, selectedRoleId);
      resetForm();
    } catch (e) {
      console.error("Error updating user role:", e);
      alert("Error al actualizar rol");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {usersCount} {usersCount === 1 ? "miembro" : "miembros"} asignados
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsManaging(true)}>
          <UserPlus className="h-4 w-4" />
          Asignar Miembro
        </Button>
      </div>

      {(isManaging || editingUser) && (
        <Card className="border-primary/50 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {editingUser ? (
                  <><Edit2 className="h-4 w-4 text-primary" /> Editar Rol de {editingUser.name}</>
                ) : (
                  <><UserPlus className="h-4 w-4 text-primary" /> Asignar Nuevo Miembro</>
                )}
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingUser && (
                <div className="space-y-2">
                  <Label>Seleccionar Usuario</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Selecciona un usuario...</option>
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Seleccionar Rol</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                >
                  <option value="">Selecciona un rol...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>
              <Button 
                size="sm" 
                className="gap-2" 
                onClick={editingUser ? handleUpdateRole : handleAssign}
                disabled={formLoading || (!editingUser && !selectedUserId) || !selectedRoleId}
              >
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {editingUser ? "Actualizar Rol" : "Asignar al Proyecto"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {usersCount > 0 ? (
        users.map(user => (
          <Card key={user.appUserId} className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50">
            <CardContent className="p-2 flex items-center gap-4">
              <div
                aria-hidden
                className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg"
              >
                {`${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold truncate">
                  {user.name} {user.surname}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-5">
                    {user.role?.name || "Colaborador"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setEditingUser(user);
                    setSelectedRoleId(user.role?.id || "");
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.name} del proyecto?`)) {
                      setActionLoading(user.appUserId);
                      try {
                        await removeUser(projectId, user.appUserId);
                      } catch (e) {
                        alert("Error al eliminar usuario");
                      } finally {
                        setActionLoading(null);
                      }
                    }
                  }}
                  disabled={actionLoading === user.appUserId}
                >
                  {actionLoading === user.appUserId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
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