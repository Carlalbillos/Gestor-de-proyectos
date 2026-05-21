import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, Button, Label, Input, DetailItem, EditButton, FormActions } from "@/presentation/ui";
import { Lock, Mail, Shield, Briefcase, Clock, Calendar } from "lucide-react";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { isAdmin } from "@/domain/services/role.service";
import type { User } from "@/domain/entities/user.entity";

interface UserInfoTabProps {
  user: User;
  currentUser: User | null;
  projectsCount: number;
  totalHours: number;
  timeEntriesCount: number;
  isLoading: boolean;
  onUpdate: (data: any) => Promise<void>;
  onOpenPasswordModal: () => void;
}

export const UserInfoTab = ({
  user,
  currentUser,
  projectsCount,
  totalHours,
  timeEntriesCount,
  isLoading,
  onUpdate,
  onOpenPasswordModal
}: UserInfoTabProps) => {
  const editing = useDisclosure();
  const isSelf = currentUser?.id === user.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { },
  } = useForm({
    defaultValues: {
      name: user.name,
      surname: user.surname,
      email: user.email.getValue(),
      role: user.role.getValue(),
    }
  });

  const startEditing = () => {
    reset({
      name: user.name,
      surname: user.surname,
      email: user.email.getValue(),
      role: user.role.getValue(),
    });
    editing.open();
  };

  const onEditSubmit = async (data: any) => {
    try {
      await onUpdate(data);
      editing.close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
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
                  onClick={onOpenPasswordModal}
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
              <DetailItem label="Rol de Sistema" value={user.role.isAdmin() ? "Administrador" : "Empleado"} icon={<Lock />} />
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
                <p className="font-bold text-foreground">{projectsCount} proyectos asignados</p>
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
                <p className="font-bold text-foreground">{timeEntriesCount} imputaciones</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
