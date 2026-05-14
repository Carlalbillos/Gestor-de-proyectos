import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useUserDetailsStore } from "@/presentation/stores/user-details.store";
import { Badge } from "@/presentation/components/ui/badge";
import { Mail, Shield, Briefcase, Clock } from "lucide-react";
import { PageLoader } from "@/presentation/components/shared/page-loader";
import { DetailError } from "@/presentation/components/shared/detail-error";
import { isAdmin } from "@/domain/services/role.service";
import { AdminChangePasswordModal } from "@/presentation/components/users/AdminChangePasswordModal";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { UserInfoTab } from "@/presentation/components/users/UserInfoTab";
import { UserProjectsTab } from "@/presentation/components/users/UserProjectsTab";
import { UserTimeEntriesTab } from "@/presentation/components/users/UserTimeEntriesTab";

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
  const toggleConfirm = useDisclosure();
  const deleteConfirm = useDisclosure();

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
          <UserInfoTab 
            user={user}
            currentUser={currentUser}
            projectsCount={projects.length}
            totalHours={totalHours}
            timeEntriesCount={timeEntries.length}
            isLoading={isLoading}
            onUpdate={(data) => updateUser(user.id, { ...data, isActive: user.isActive })}
            onOpenPasswordModal={passwordModal.open}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-0 focus-visible:ring-0">
          <UserProjectsTab projects={projects} />
        </TabsContent>

        <TabsContent value="entries" className="mt-0 focus-visible:ring-0">
          <UserTimeEntriesTab timeEntries={timeEntries} />
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
