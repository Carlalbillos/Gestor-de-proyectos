import { useState } from "react";
import type { ProjectUser, ProjectRole } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import { Card, CardContent, Button, Badge, Label, ConfirmDialog, EditButton, DeleteButton } from "@/presentation/ui";
import { UserPlus, Loader2, X, Check, XCircle, Briefcase } from "lucide-react";
import { useProjectDetailsStore } from "@/presentation/modules/project/stores/project-details.store";
import { isAdmin } from "@/domain/services/role.service";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";

interface ProjectTeamTabProps {
  users: ProjectUser[];
  roles: ProjectRole[];
  allUsers: User[];
  projectId: string;
}

export const ProjectTeamTab = ({ users, roles, allUsers, projectId }: ProjectTeamTabProps) => {
  const usersCount = users.length;
  const { changeUserStatus, updateUserRole, assignUser } = useProjectDetailsStore();
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

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    setActionLoading(userId);
    setTabError(null);
    try {
      await changeUserStatus(projectId, userId, isActive);
      setShowDeleteConfirm(null);
    } catch (e: any) {
      if (!isActive && e.status === 409) {
        setTabError("No se puede desvincular al usuario porque tiene horas imputadas en este proyecto.");
      } else {
        setTabError(`Error al ${isActive ? "activar" : "desactivar"} usuario`);
      }
      setShowDeleteConfirm(null);
    } finally {
      setActionLoading(null);
    }
  };
  const user = useAuthStore((state) => state.user);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {usersCount} {usersCount === 1 ? "miembro" : "miembros"} asignados
        </div>
        {isAdmin(user) && (
          <Button size="sm" className="gap-2" onClick={() => setIsManaging(true)}>
            <UserPlus className="h-4 w-4" />
            Asignar Miembro
          </Button>
        )}
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
        onConfirm={() => handleStatusChange(showDeleteConfirm!, false)}
        title="Desactivar miembro del proyecto"
        description={tabError || "¿Estás seguro de que deseas desactivar a este usuario en el proyecto?"}
        confirmText="Desvincular"
        isLoading={!!actionLoading}
      />

      {isAdmin(user) && (isManaging || editingUser) && (
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
                    <option key={r.getId()} value={r.getId()}>{r.getLabel()}</option>
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
            {users.map(member => (
              <Card key={member.appUserId} className={`border-muted/50 hover:border-primary/30 ${member.isActive === false ? "opacity-70 bg-muted/20" : ""}`}>
                <CardContent className="p-3 flex items-center gap-4">
                  <div
                    aria-hidden
                    className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${member.isActive === false ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"}`}
                  >
                    {`${member.name?.[0] ?? ""}${member.surname?.[0] ?? ""}`}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold truncate text-base flex items-center gap-2">
                      {member.name} {member.surname}
                      {member.isActive === false && (
                        <Badge variant="secondary" className="text-[10px] uppercase h-4 px-1.5 py-0 bg-muted-foreground/20 text-muted-foreground">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-5 bg-background/80">
                        {member.role ? member.role.getLabel() : "Colaborador"}
                      </Badge>
                    </div>
                  </div>

                  {isAdmin(user) && (
                    <div className="flex items-center gap-1">
                      <EditButton
                        label=""
                        onClick={() => {
                          setEditingUser(member);
                          setSelectedRoleId(member.role ? member.role.getId() : "");
                        }}
                      />
                      {member.isActive === false ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                          title="Activar usuario en el proyecto"
                          onClick={() => handleStatusChange(member.appUserId, true)}
                          disabled={actionLoading === member.appUserId}
                        >
                          {actionLoading === member.appUserId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <DeleteButton
                          label=""
                          onClick={() => setShowDeleteConfirm(member.appUserId)}
                          isLoading={actionLoading === member.appUserId}
                        />
                      )}
                    </div>
                  )}
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