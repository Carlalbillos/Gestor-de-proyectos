import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUsersListStore } from "@/infrastructure/stores/users-list.store";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Users, UserPlus, Loader2, Search, Mail, Shield } from "lucide-react";
import { isAdmin } from "@/infrastructure/ui/lib/roleChecker";

export const UsersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items: users, isLoading, error, search, filterStatus, filterRole, fetchUsers, setSearch, setFilterStatus, setFilterRole } = useUsersListStore();
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios de tu organización
          </p>
        </div>
        <Button className="w-full sm:w-auto shadow-sm" onClick={() => navigate("/personal/nuevo")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1 w-4">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre o email..."
                className="pl-9 bg-muted/30 h-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="user-filter-status">Filtrar estado</label>
              <select
                id="user-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">No activos</option>
              </select>
              <label className="sr-only" htmlFor="user-filter-role">Filtrar rol</label>
              <select
                id="user-filter-role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "all" | "admin" | "user")}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
              <Button type="submit" variant="secondary" disabled={isLoading} className="px-6 h-10">
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && users.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <Loader2 className="h-10 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
        </div>
      ) : users.length === 0 && !error ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">No se encontraron usuarios</h3>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm">
              {search
                ? "No hay resultados para tu búsqueda. Intenta con otros términos para encontrar lo que buscas."
                : "No hay usuarios registrados aún."}
            </p>
            {filterStatus === "all" && filterRole === "all" && (
              <Button className="mt-6 shadow-sm" onClick={() => navigate("/personal/nuevo")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Crear el primer Usuario
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((u) => (
            <Card
              key={u.id}
              className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer group bg-card"
              onClick={() => navigate(`/personal/${u.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-1">
                  <Badge
                    variant={u.is_active ? "default" : "secondary"}
                    className={u.is_active ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" : ""}
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-5 bg-background">
                    <Shield className="mr-1 h-3 w-3" />
                    {isAdmin(u) ? "Administrador" : "Empleado"}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-1" title={`${u.name} ${u.surname}`}>
                  {u.name} {u.surname}
                </CardTitle>
                <CardDescription className="line-clamp-1 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {u.email}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
