import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { useDashboardStore } from "@/infrastructure/stores/dashboard.store";

import { Button } from "@/presentation/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/presentation/ui/components/ui/card";
import { Badge } from "@/presentation/ui/components/ui/badge";
import { TimeEntriesTable } from "@/presentation/ui/components/shared/TimeEntriesTable";
import { Users, ChevronRight, Briefcase, Clock } from "lucide-react";
import { isAdmin } from "@/presentation/ui/lib/roleChecker";

export const HomePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { profile, projects, timeEntries, totalHours, isLoading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, fetchDashboardData]);

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-destructive/10 text-destructive border-l-4 border-destructive p-4 rounded-md">
          <h3 className="font-bold">Error al cargar el dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando tu dashboard...</div>;
  }

  const initials = `${profile.name?.[0] || ""}${profile.surname?.[0] || ""}`.toUpperCase();
  const roleName = isAdmin(profile) ? "Administrador" : "Usuario";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabecera de Bienvenida */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">¡Hola, {profile.name}!</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona tus proyectos y horas de trabajo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Columna Izquierda: Perfil del Usuario */}
        <div className="md:col-span-1 space-y-6">
          <Card className="">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Tu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
                <span className="text-3xl font-bold text-primary">{initials || "U"}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{profile.name} {profile.surname}</h3>
                <p className="text-sm text-muted-foreground">{profile.email.getValue()}</p>
              </div>

              <Badge variant="secondary" className="px-4 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
                {roleName}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Listado de proyectos y horas */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Sección de Proyectos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Tus Proyectos
                </h2>
                <p className="text-sm text-muted-foreground">Proyectos en los que estás asignado</p>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => navigate("/proyectos")}>
                Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-2 p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No tienes proyectos asignados actualmente.
                </div>
              ) : (
                projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                        {project.description || "Sin descripción"}
                      </CardDescription>
                    </CardHeader>
                    <div className="flex-1"></div>
                    <CardFooter className="pt-3 border-t bg-muted/20">
                      <div className="flex items-center text-sm text-muted-foreground justify-between w-full">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {project.teamMembers != null ? project.teamMembers : 0} miembros
                        </div>
                        {project.client?.name && (
                          <span className="text-xs max-w-[100px]" title={project.client.name}>
                            {project.client.name}
                          </span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            <Button variant="outline" className="w-full sm:hidden mt-2" onClick={() => navigate("/proyectos")}>
              Ver Todos Proyectos
            </Button>
          </div>

          {/* Sección de Imputaciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Tus Imputaciones Recientes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Últimas horas registradas (Total acumulado: <span className="font-bold text-foreground">{totalHours}h</span>)
                </p>
              </div>
            </div>

            <TimeEntriesTable entries={timeEntries} mode="user" />
          </div>

        </div>

      </div>
    </div>
  );
};
