import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useClientsListStore } from "@/infrastructure/stores/clients-list.store";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Building2, Briefcase, UserPlus, Loader2, Search, Tags } from "lucide-react";

export const ClientsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items: clients, isLoading, error, search, filterStatus, fetchClients, setSearch, setFilterStatus } = useClientsListStore();
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

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
          <Button variant="outline" className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/sectores/nuevo")}>
            <Tags className="mr-2 h-4 w-4" />
            Nuevo Sector
          </Button>
          <Button className="flex-1 sm:flex-none shadow-sm" onClick={() => navigate("/clientes/nuevo")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1 w-4">
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
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">No activos</option>
              </select>
              <Button type="submit" variant="secondary" disabled={isLoading} className="px-6 h-10">
                Buscar
              </Button>
            </div>
          </form>
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
                    variant={client.is_active ? "default" : "secondary"}
                    className={client.is_active ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" : ""}
                  >
                    {client.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-1" title={client.name}>
                  {client.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 mt-1">
                  {client.sector?.name || "Sin sector asignado"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-2.5 h-4 w-4 text-primary/60" />
                    <span className="font-medium text-foreground line-clamp-1">
                      {client.sector?.name || "—"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
