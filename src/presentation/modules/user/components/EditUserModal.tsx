import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from "@/presentation/ui";
import { Loader2, X, Save, Edit, UserCircle } from "lucide-react";
import { useUserDetailsStore } from "@/presentation/modules/user/stores/user-details.store";
import type { User } from "@/domain/entities/user.entity";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
  const { updateUser, isLoading } = useUserDetailsStore();
  const [prevUser, setPrevUser] = useState(user);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    email: user.email.getValue(),
    role: user.role.getValue(),
    isActive: user.isActive,
  });
  const [error, setError] = useState<string | null>(null);

  if (user !== prevUser || isOpen !== prevIsOpen) {
    setPrevUser(user);
    setPrevIsOpen(isOpen);
    setFormData({
      name: user.name,
      surname: user.surname,
      email: user.email.getValue(),
      role: user.role.getValue(),
      isActive: user.isActive,
    });
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateUser(user.id, {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el usuario");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Editar Usuario</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Apellidos</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive">Usuario activo</Label>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
