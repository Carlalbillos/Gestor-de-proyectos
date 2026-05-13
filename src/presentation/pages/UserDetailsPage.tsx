import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useUserDetailsStore } from "@/presentation/stores/user-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Lock, Mail, Shield, Briefcase, Clock, Calendar } from "lucide-react";
import { PageLoader } from "@/presentation/components/shared/page-loader";
import { DetailError } from "@/presentation/components/shared/detail-error";
import { isAdmin } from "@/domain/services/role.service";
import { AdminChangePasswordModal } from "@/presentation/components/users/AdminChangePasswordModal";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
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

  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    setDeleteError(null);
    try {
      await deleteUser(user!.id);
      navigate("/personal");
    } catch (e: any) {
      setDeleteError(e.message || "No se ha podido eliminar el usuario.");
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
    return <PageLoader variant="detail" message="Cargando detalles del usuario..." />;
  }

  if (error || !user) {
    return (
      <DetailError
        message={error || "El usuario que buscas no existe o ha sido eliminado."}
        title="Error al cargar el usuario"
        backLabel="Volver al listado"
        onBack={() => navigate("/personal")}
      />
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

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-8">
          <TabsTrigger value="perfil" className="flex gap-2">
            <Shield className="h-4 w-4" /> 
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex gap-2">
            <Briefcase className="h-4 w-4" /> 
            <span className="hidden sm:inline">Proyectos</span>
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex gap-2">
            <Clock className="h-4 w-4" /> 
            <span className="hidden sm:inline">Registros</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-0 focus-visible:ring-0">
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {/* INFO CARD */}
            <Card className="border-muted/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Información Personal
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isAdmin(currentUser) && !editing.isOpen && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={passwordModal.open}
                        title="Cambiar contraseña"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <EditButton onClick={startEditing} />
                    </>
                  )}
                </div>
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
                    </div>
                    <FormActions isSaving={isLoading} onCancel={editing.close} />
                  </form>
                ) : (
                  <div className="space-y-6">
                    <DetailItem label="Nombre Completo" value={`${user.name} ${user.surname}`} icon={<Shield />} />
                    <DetailItem label="Correo Electrónico" value={user.email.getValue()} icon={<Mail />} />
                    <DetailItem label="Rol de Sistema" value={user.role === "admin" ? "Administrador" : "Empleado"} icon={<Lock />} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SUMMARY CARD */}
            <Card className="overflow-hidden border-muted/60 shadow-sm h-full">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Resumen de Actividad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-0 focus-visible:ring-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Proyectos Asignados</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="group border-muted/50 hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</p>
                        <Badge variant={project.isActive ? "default" : "secondary"}>
                          {project.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {project.description || "Sin descripción disponible."}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic col-span-full text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                  No hay proyectos asignados.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="mt-0 focus-visible:ring-0">
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
        </TabsContent>
      </Tabs>

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
        onClose={() => { deleteConfirm.close(); setDeleteError(null); }}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isLoading}
        errorMessage={deleteError ?? undefined}
      />
    </div>
  );
};
