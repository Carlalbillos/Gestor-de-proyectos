import { useState } from "react";
import type { ProjectUser, ProjectRole } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus, Loader2, X, Check, XCircle, Briefcase } from "lucide-react";
import { useProjectDetailsStore } from "@/infrastructure/stores/project-details.store";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { ConfirmDialog } from "../shared/confirm-dialog";
import { EditButton } from "../shared/edit-button";
import { DeleteButton } from "../shared/delete-button";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [tabError, setTabError] = useState<string | null>(null);

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
    setTabError(null);
    try {
      await assignUser(projectId, selectedUserId, selectedRoleId);
      resetForm();
    } catch (e: any) {
      console.error("Error assigning user:", e);
      setTabError(e.message || "Error al asignar usuario");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !selectedRoleId) return;
    setFormLoading(true);
    setTabError(null);
    try {
      await updateUserRole(projectId, editingUser.appUserId, selectedRoleId);
      resetForm();
    } catch (e: any) {
      console.error("Error updating user role:", e);
      setTabError(e.message || "Error al actualizar rol");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    setTabError(null);
    try {
      await removeUser(projectId, userId);
      setShowDeleteConfirm(null);
    } catch (e: any) {
      if (e.status === 409) {
        setTabError("No se puede eliminar al usuario porque tiene horas imputadas en este proyecto.");
      } else {
        setTabError("Error al eliminar usuario");
      }
      setShowDeleteConfirm(null);
    } finally {
      setActionLoading(null);
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

      {tabError && (
        <Card className="border-destructive/30 bg-destructive/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm font-medium text-destructive">{tabError}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setTabError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(null);
          setTabError(null);
        }}
        onConfirm={() => handleDelete(showDeleteConfirm!)}
        title="Eliminar miembro del proyecto"
        description={tabError || "¿Estás seguro de que deseas desvincular a este usuario del proyecto?"}
        confirmText="Eliminar"
        isLoading={!!actionLoading}
      />

      {(isManaging || editingUser) && (
        <Card className="border-primary/50 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {editingUser ? (
                  <><Briefcase className="h-4 w-4 text-primary" /> Editar Rol de {editingUser.name}</>
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
        <Card className="border-muted/60 shadow-sm bg-card/30">
          <CardContent className="p-4 grid gap-4">
            {users.map(user => (
              <Card key={user.appUserId} className="border-muted/50 hover:border-primary/30">
                <CardContent className="p-3 flex items-center gap-4">
                  <div
                    aria-hidden
                    className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    {`${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate text-base">
                      {user.name} {user.surname}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-5 bg-background/80">
                        {user.role?.name || "Colaborador"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <EditButton
                      label=""
                      onClick={() => {
                        setEditingUser(user);
                        setSelectedRoleId(user.role?.id || "");
                      }}
                    />
                    <DeleteButton
                      label=""
                      onClick={() => setShowDeleteConfirm(user.appUserId)}
                      isLoading={actionLoading === user.appUserId}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground italic">
              No hay miembros asignados a este equipo todavía.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};