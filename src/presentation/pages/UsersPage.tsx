import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import { useUsersListStore } from "@/presentation/stores/users-list.store";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { StatusBadge } from "@/presentation/components/shared/StatusBadge";
import { EmptyState } from "@/presentation/components/shared/EmptyState";
import { PageHeader } from "@/presentation/components/shared/PageHeader";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Users, UserPlus, Loader2, Search, Mail, Shield } from "lucide-react";
import { isAdmin } from "@/domain/services/role.service";
import { Pagination } from "@/presentation/components/shared/pagination";

export const UsersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    items: users,
    total,
    page,
    limit,
    isLoading,
    error,
    search,
    filterStatus,
    filterRole,
    fetchUsers,
    setSearch,
    setFilterStatus,
    setFilterRole,
    setPage,
  } = useUsersListStore();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Personal" 
        description="Gestiona el equipo de tu organización y sus permisos"
      >
        {isAdmin(user) && (
          <Button className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/personal/nuevo")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        )}
      </PageHeader>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1">
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
              <select
                id="user-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <select
                id="user-filter-role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "all" | "admin" | "user")}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && users.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <Loader2 className="h-10 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
        </div>
      ) : users.length === 0 && !error ? (
        <EmptyState
          icon={Users}
          title="No se encontraron usuarios"
          description={filterStatus !== "all" 
            ? `No hay usuarios con estado "${filterStatus === 'active' ? 'activo' : 'inactivo'}" que coincidan con tu búsqueda.`
            : "Aún no hay usuarios registrados en la plataforma."
          }
          action={
            <Button onClick={() => navigate("/usuarios/nuevo")} className="gap-2">
              Registrar primer usuario
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((u) => (
              <Card
                key={u.id}
                className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer group bg-card"
                onClick={() => navigate(`/personal/${u.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <StatusBadge isActive={u.isActive} />

                    {isAdmin(u) && (
                      <Badge variant="secondary" className="bg-primary flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Administrador
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-1" title={`${u.name} ${u.surname}`}>
                    {u.name} {u.surname}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {u.email.getValue()}
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Pagination
            totalPages={total >= limit ? page + 1 : page}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
