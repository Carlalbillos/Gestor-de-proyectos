import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useUserDetailsStore } from "@/infrastructure/stores/user-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/components/ui/card";
import { Badge } from "@/presentation/ui/components/ui/badge";
import { Button } from "@/presentation/ui/components/ui/button";
import { Lock, ArrowLeft, Loader2, CheckCircle2, XCircle, Mail, Shield, Briefcase, Clock, Calendar } from "lucide-react";
import { isAdmin } from "@/presentation/ui/lib/roleChecker";
import { AdminChangePasswordModal } from "@/presentation/ui/components/users/AdminChangePasswordModal";
import { EditUserModal } from "@/presentation/ui/components/users/EditUserModal";
import { useState, useCallback } from "react";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Edit, Power, Trash2 } from "lucide-react";

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
    deactivateUser,
    deleteUser,
    adminChangePassword,
    clearDetails
  } = useUserDetailsStore();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleToggleActive = useCallback(async () => {
    if (!user) return;
    const action = user.isActive ? "desactivar" : "activar";
    if (confirm(`¿Estás seguro de que deseas ${action} a este usuario?`)) {
      try {
        await deactivateUser(user.id, !user.isActive);
      } catch (err) {
        // Error handled by store
      }
    }
  }, [user, deactivateUser]);

  const handleDelete = useCallback(async () => {
    if (!user) return;
    if (confirm(`¿Estás seguro de que deseas borrar a ${user.name}? Esta acción no se puede deshacer.`)) {
      try {
        await deleteUser(user.id);
        navigate("/personal");
      } catch (err) {
        // Error handled by store
      }
    }
  }, [user, deleteUser, navigate]);

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchUserDetails, clearDetails]);

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 mt-8">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Error al cargar el usuario</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/personal")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Personal
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate("/personal")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {user.name.charAt(0)}{user.surname.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{user.name} {user.surname}</h1>
              <div className="flex flex-col gap-1.5 mt-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email.getValue()}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-background w-fit">
                    <Shield className="mr-1 h-3 w-3 flex items-center justify-center" />
                    {isAdmin(user) ? "Administrador" : "Empleado"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">

          {isAdmin(currentUser) && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm border-primary/20 hover:bg-primary/5"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4 text-primary" />
                Editar
              </Button>
              <Button
                variant={user.isActive ? "destructive" : "outline"}
                size="sm"
                className="shadow-sm"
                onClick={handleToggleActive}
                disabled={isLoading}
              >
                <Power className="mr-2 h-4 w-4" />
                {user.isActive ? "Inactivar" : "Activar"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="shadow-sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm border-primary/20 hover:bg-primary/5"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <Lock className="mr-2 h-4 w-4 text-primary" />
                Cambiar contraseña
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
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
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Projects Section */}
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
                          className={project.isActive ? "bg-green-500/10 text-green-700 border-green-200 shrink-0" : "shrink-0"}
                        >
                          {project.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted sm:col-span-2">
                  No hay proyectos asignados a este usuario.
                </p>
              )}
            </div>
          </section>

          {/* Time Entries Section */}
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
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userName={user.name}
        onSubmit={(password) => adminChangePassword(user.id, password)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
};
