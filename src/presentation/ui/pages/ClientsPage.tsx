import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useClientsListStore } from "@/infrastructure/stores/clients-list.store";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/ui/components/ui/card";
import { Badge } from "@/presentation/ui/components/ui/badge";
import { Button } from "@/presentation/ui/components/ui/button";
import { Input } from "@/presentation/ui/components/ui/input";
import Pagination from "../components/ui/pagination";
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

  // Búsqueda reactiva con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [fetchClients, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes de tu organización
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/clientes/sectores")}>
            <Tags className="mr-2 h-4 w-4" />
            Administrar sectores
          </Button>
          <Button className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/clientes/nuevo")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

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
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">No se encontraron clientes</h3>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm">
              {search
                ? "No hay resultados para tu búsqueda. Intenta con otros términos para encontrar lo que buscas."
                : "No hay clientes registrados aún."}
            </p>
            {filterStatus === "all" && (
              <Button className="mt-6 shadow-sm" onClick={() => navigate("/clientes/nuevo")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Crear el primer Cliente
              </Button>
            )}
          </CardContent>
        </Card>
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
                    <Badge
                      variant={client.isActive ? "default" : "secondary"}
                      className={client.isActive ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" : ""}
                    >
                      {client.isActive ? "Activo" : "Inactivo"}
                    </Badge>
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
