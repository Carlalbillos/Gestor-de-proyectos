import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useProjectsListStore } from "@/infrastructure/stores/projects-list.store";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { isAdmin } from "@/infrastructure/ui/lib/roleChecker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Input } from "@/infrastructure/ui/components/ui/input";
import { Building2, Users, Search, FolderPlus, Loader2, Lock } from "lucide-react";

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { projects, isLoading, error, search, filterStatus, fetchProjects, setSearch, setFilterStatus } = useProjectsListStore();
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [fetchProjects, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const canCreateProject = isAdmin(user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">
            {canCreateProject ? "Gestiona los proyectos de tu organización" : "Ve los proyectos de tu organización"}
          </p>
        </div>
        {canCreateProject ? (
          <Button className="w-full sm:w-auto shadow-sm" onClick={() => navigate("/proyectos/nuevo")}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        ) : (
          <Button 
            className="w-full sm:w-auto shadow-sm" 
            disabled 
            title="Solo los administradores pueden crear proyectos"
          >
            <Lock className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1 w-4">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar proyectos por nombre..."
                className="pl-9 bg-muted/30 h-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="project-filter-status">Filtrar estado</label>
              <select
                id="project-filter-status"
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

      

      {isLoading && projects.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <Loader2 className="h-10 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Cargando proyectos...</p>
        </div>
      ) : projects.length === 0 && !error ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FolderPlus className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">No se encontraron proyectos</h3>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm">
              {search 
                ? "No hay resultados para tu búsqueda. Intenta con otros términos para encontrar lo que buscas." 
                : "No hay proyectos registrados aún."}
            </p>
            {!search && canCreateProject && (
              <Button className="mt-6 shadow-sm" onClick={() => navigate("/proyectos/nuevo")}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Crear el primer Proyecto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer group bg-card"
                onClick={() => navigate(`/proyectos/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <Badge 
                      variant={project.is_active ? "default" : "secondary"} 
                      className={project.is_active ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" : ""}
                    >
                      {project.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-1" title={project.name}>
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10 mt-1">
                    {project.description || "Este proyecto no tiene una descripción detallada asignada."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <div className="space-y-3 mt-2">
                    {project.client && (
                      <div className="flex items-center text-sm text-muted-foreground bg-muted/40 p-2 rounded-md">
                        <Building2 className="mr-2.5 h-4 w-4 text-primary/60" />
                        <span className="font-medium text-foreground/80 line-clamp-1" title={project.client.name}>
                          {project.client.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground px-2">
                      <Users className="mr-2.5 h-4 w-4 text-muted-foreground/70" />
                      <span>{project.team_members || 0} miembros</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
