import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import { useClientsListStore } from "@/infrastructure/stores/clients-list.store";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/ui/components/ui/card";
import { StatusBadge } from "@/presentation/ui/components/shared/StatusBadge";
import { EmptyState } from "@/presentation/ui/components/shared/EmptyState";
import { PageHeader } from "@/presentation/ui/components/shared/PageHeader";
import { Button } from "@/presentation/ui/components/ui/button";
import { Input } from "@/presentation/ui/components/ui/input";
import { Pagination } from "@/presentation/ui/components/shared/pagination";
import { Building2, UserPlus, Loader2, Search, Tags } from "lucide-react";

export const ClientsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    items: clients,
    total,
    page,
    limit,
    isLoading,
    error,
    search,
    filterStatus,
    fetchClients,
    setSearch,
    setFilterStatus,
    setPage,
  } = useClientsListStore();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Búsqueda reactiva con debounce
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [fetchClients, user]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gestiona los clientes de tu organización"
      >
        <Button variant="outline" className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/clientes/sectores")}>
          <Tags className="mr-2 h-4 w-4" />
          Administrar sectores
        </Button>
        <Button className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/clientes/nuevo")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </PageHeader>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes por nombre..."
                className="pl-9 bg-muted/30 h-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="client-filter-status">Filtrar estado</label>
              <select
                id="client-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && clients.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <Loader2 className="h-10 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Cargando clientes...</p>
        </div>
      ) : clients.length === 0 && !error ? (
        <EmptyState
          icon={Building2}
          title="No se encontraron clientes"
          description={filterStatus !== "all" 
            ? `No hay clientes con estado "${filterStatus === 'active' ? 'activo' : 'inactivo'}" que coincidan con tu búsqueda.`
            : "Aún no hay clientes registrados en el sistema."
          }
          action={
            <Button onClick={() => navigate("/clientes/nuevo")} className="gap-2">
              Registrar primer cliente
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clients.map((client) => (
              <Card
                key={client.id}
                className="flex flex-col hover:border-primary/40 hover:shadow-md cursor-pointer group bg-card"
                onClick={() => navigate(`/clientes/${client.id}`)}
              >
                <CardHeader className="pb-1">
                  <div className="flex justify-between items-start">
                    <StatusBadge isActive={client.isActive} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-1" title={client.name}>
                    {client.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10 mt-1">
                    {client.sector?.name || "Sin sector asignado"}
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
