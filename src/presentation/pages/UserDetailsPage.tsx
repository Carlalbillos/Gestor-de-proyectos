import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useUserDetailsStore } from "@/presentation/stores/user-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Lock, Loader2, XCircle, Mail, Shield, Briefcase, Clock, Calendar } from "lucide-react";
import { isAdmin } from "@/domain/services/role.service";
import { AdminChangePasswordModal } from "@/presentation/components/users/AdminChangePasswordModal";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { useForm } from "react-hook-form";
import { DetailItem } from "@/presentation/components/shared/detail-item";
import { EditButton } from "@/presentation/components/shared/edit-button";
import { FormActions } from "@/presentation/components/shared/form-actions";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

export const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const {
    user,
    projects,
    timeEntries,
    totalHours,
    isLoading,
    error,
    fetchUserDetails,
    updateUser,
    changeActivityUser,
    deleteUser,
    adminChangePassword,
    clearDetails
  } = useUserDetailsStore();

  const passwordModal = useDisclosure();
  const editing = useDisclosure();
  const toggleConfirm = useDisclosure();
  const deleteConfirm = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      role: "user",
    }
  });

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchUserDetails, clearDetails]);

  const handleToggleActive = async () => {
    toggleConfirm.close();
    try {
      await changeActivityUser(user!.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    deleteConfirm.close();
    try {
      await deleteUser(user!.id);
      navigate("/usuarios");
    } catch (e) {
      console.error(e);
    }
  };

  const startEditing = () => {
    if (!user) return;
    reset({
      name: user.name,
      surname: user.surname,
      email: user.email.getValue(),
      role: user.role,
    });
    editing.open();
  };

  const onEditSubmit = async (data: any) => {
    if (!user) return;
    try {
      await updateUser(user.id, {
        ...data,
        isActive: user.isActive
      });
      editing.close();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del usuario...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="h-12 w-12 text-destructive/50" />
        <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
        <p className="text-muted-foreground">{error || "El usuario que buscas no existe o ha sido eliminado."}</p>
        <Button onClick={() => navigate("/usuarios")}>Volver al listado</Button>
      </div>
    );
  }

  const isSelf = currentUser?.id === user.id;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <DetailsHeader
        title={`${user.name} ${user.surname}`}
        onBack={() => navigate("/personal")}
        isActive={user.isActive}
        onToggleStatus={!isSelf ? toggleConfirm.open : undefined}
        onDelete={!isSelf ? deleteConfirm.open : undefined}
        isToggling={isLoading}
        showActions={!isSelf}
        icon={<div className="font-bold text-xl text-primary">{user.name.charAt(0)}{user.surname.charAt(0)}</div>}
        subTitle={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background">
              <Shield className="mr-1 h-3 w-3 text-primary" />
              {isAdmin(user) ? "Administrador" : "Empleado"}
            </Badge>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email.getValue()}
            </span>
          </div>
        }
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-muted/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Información Personal
              </CardTitle>
              {isAdmin(currentUser) && !editing.isOpen && (
                <EditButton onClick={startEditing} />
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {editing.isOpen ? (
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" {...register("name", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Apellidos</Label>
                    <Input id="surname" {...register("surname", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol de Sistema</Label>
                    <select
                      id="role"
                      {...register("role")}
                      disabled={isSelf}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70 disabled:bg-muted"
                    >
                      <option value="user">Empleado</option>
                      <option value="admin">Administrador</option>
                    </select>
                    {isSelf && (
                      <p className="text-[10px] text-muted-foreground italic">
                        No puedes cambiar tu propio rol de sistema.
                      </p>
                    )}
                  </div>
                  <FormActions isSaving={isLoading} onCancel={editing.close} />
                </form>
              ) : (
                <div className="space-y-6">
                  <DetailItem
                    label="Nombre Completo"
                    value={`${user.name} ${user.surname}`}
                    icon={<Shield />}
                  />
                  <DetailItem
                    label="Correo Electrónico"
                    value={user.email.getValue()}
                    icon={<Mail />}
                  />
                  <DetailItem
                    label="Rol de Sistema"
                    value={user.role === "admin" ? "Administrador" : "Empleado"}
                    icon={<Lock />}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-muted/60 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Proyectos</p>
                  <p className="font-bold text-foreground">{projects.length} proyectos asignados</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Horas Totales</p>
                  <p className="font-bold text-foreground">{totalHours}h imputadas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Registros</p>
                  <p className="font-bold text-foreground">{timeEntries.length} imputaciones</p>
                </div>
              </div>

              {isAdmin(currentUser) && (
                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={passwordModal.open}>
                    <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Proyectos Asignados</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50 cursor-pointer"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-foreground">{project.name}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {project.description || "Sin descripción"}
                          </p>
                        </div>
                        <Badge
                          variant={project.isActive ? "default" : "secondary"}
                        >
                          {project.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted sm:col-span-2 text-center">
                  No hay proyectos asignados a este usuario.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Imputaciones de Horas</h2>
              {totalHours > 0 && (
                <Badge variant="outline" className="ml-2 bg-background">
                  {totalHours}h total
                </Badge>
              )}
            </div>
            <div className="space-y-3">
              {timeEntries.length > 0 ? (
                timeEntries.map((entry) => (
                  <Card key={entry.id} className="border-muted/60 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">{entry.project.name}</p>
                          <p className="text-sm text-muted-foreground">{entry.comment}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="outline" className="bg-background">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Badge>
                          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                            <Clock className="mr-1 h-3 w-3" />
                            {entry.hour}h
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted">
                  No se han registrado imputaciones de horas para este usuario.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <AdminChangePasswordModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.close}
        userName={user.name}
        onSubmit={(password) => adminChangePassword(user.id, password)}
      />

      <ConfirmDialog
        isOpen={toggleConfirm.isOpen}
        onClose={toggleConfirm.close}
        onConfirm={handleToggleActive}
        title={user.isActive ? "Desactivar Usuario" : "Activar Usuario"}
        description={`¿Estás seguro de que deseas ${user.isActive ? "desactivar" : "activar"} a ${user.name}?`}
        confirmText={user.isActive ? "Desactivar" : "Activar"}
        variant={user.isActive ? "destructive" : "default"}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isLoading}
      />
    </div>
  );
};
