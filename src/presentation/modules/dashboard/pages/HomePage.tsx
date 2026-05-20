import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { useDashboardStore } from "@/presentation/modules/dashboard/stores/dashboard.store";

import { TimeEntriesTable } from "@/presentation/modules/shared/components/TimeEntriesTable";
import { Button, Card, CardDescription, CardHeader, CardTitle, CardFooter, Badge, PageHeader, EmptyState } from "@/presentation/ui";
import { Users, ChevronRight, Briefcase, Clock } from "lucide-react";

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader 
        title={`¡Hola, ${profile.name}!`} 
        description="Gestiona tus proyectos y horas de trabajo"
      />

      <div className="space-y-8">

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={Briefcase}
                  title="Sin proyectos asignados"
                  description="Actualmente no tienes proyectos asignados. Cuando seas incluido en un equipo, verás tus proyectos aquí."
                  className="py-12"
                />
              </div>
            ) : (
              projects.map((project) => (
                <Card
                  key={project.id}
                  className="flex flex-col hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
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
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {project.client.name}
                        </Badge>
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
          <div className="flex items-center justify-between border-b pb-4">
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
  );
};
