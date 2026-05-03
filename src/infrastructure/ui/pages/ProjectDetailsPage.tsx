import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProjectDetailsStore } from "@/infrastructure/stores/project-details.store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/infrastructure/ui/components/ui/tabs";
import {
  Building2,
  Calendar,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Code2,
  ExternalLink,
  Info,
  Briefcase,
  Clock
} from "lucide-react";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, users, developments, isLoading, error, fetchProjectDetails, clearDetails } = useProjectDetailsStore();

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchProjectDetails, clearDetails]);

  if (isLoading && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 mt-8">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Error al cargar el proyecto</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/proyectos")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate("/proyectos")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight">{project.name}</h1>
              <Badge
                variant={project.is_active ? "default" : "secondary"}
                className={project.is_active ? "bg-green-500/10 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}
              >
                {project.is_active ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Activo
                  </div>
                ) : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="informacion" className="flex gap-2"><Info className="h-4 w-4" /> <span className="hidden sm:inline">Información</span></TabsTrigger>
          <TabsTrigger value="equipo" className="flex gap-2"><Users className="h-4 w-4" /> <span className="hidden sm:inline">Equipo</span></TabsTrigger>
          <TabsTrigger value="cliente" className="flex gap-2"><Building2 className="h-4 w-4" /> <span className="hidden sm:inline">Cliente</span></TabsTrigger>
          <TabsTrigger value="desarrollos" className="flex gap-2"><Code2 className="h-4 w-4" /> <span className="hidden sm:inline">Desarrollo</span></TabsTrigger>
          <TabsTrigger value="horas" className="flex gap-2"><Clock className="h-4 w-4" /> <span className="hidden sm:inline">Horas</span></TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* INFORMACIÓN TAB */}
          <TabsContent value="informacion" className="space-y-6">
            <Card className="overflow-hidden border-muted/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Descripción</p>
                  <p className="text-base text-foreground leading-relaxed">
                    {project.description || "Sin descripción disponible para este proyecto."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Cliente</p>
                      <p className="font-bold text-foreground">
                        {project.client?.name || "No asignado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Fecha de Inicio</p>
                      <p className="font-bold text-foreground">
                        {new Date(project.start_date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Equipo</p>
                      <p className="font-bold text-foreground">{users.length} miembros asignados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EQUIPO TAB */}
          <TabsContent value="equipo" className="space-y-6 ">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Equipo del Proyecto</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {users.length > 0 ? (
                users.map((user) => (
                  <Card key={user.app_user_id} className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {user.name.charAt(0)}{user.surname.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-foreground truncate">{user.name} {user.surname}</p>
                        <Badge variant="outline" className="mt-1 text-[10px] h-5 bg-background">
                          {user.role?.name || "Colaborador"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted col-span-full">
                  No hay miembros asignados a este equipo todavía.
                </p>
              )}
            </div>
          </TabsContent>

          {/* CLIENTE TAB */}
          <TabsContent value="cliente" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Información del Cliente</h2>
            </div>

            {project.client ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-muted/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nombre Comercial</p>
                      <p className="text-lg font-bold">{project.client.name}</p>
                    </div>
                    {/* Placeholder for future web entity */}
                    <div className="p-4 rounded-md bg-muted/30 border border-dashed text-sm text-muted-foreground">
                      <p>La web y más detalles del cliente se mostrarán aquí cuando la entidad esté completa.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-muted/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Contactos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for future contacts entity */}
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center border rounded-md border-dashed bg-muted/10">
                      <Briefcase className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">El listado de contactos se implementará más adelante.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted">
                Este proyecto no tiene un cliente asignado.
              </p>
            )}
          </TabsContent>

          {/* DESARROLLOS TAB */}
          <TabsContent value="desarrollos" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Desarrollos y Entornos</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {developments.length > 0 ? (
                developments.map((dev) => (
                  <Card key={dev.id} className="border-muted/60 shadow-sm overflow-hidden flex flex-col h-full">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{dev.name}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{dev.description}</CardDescription>
                        </div>
                        {dev.technology && (
                          <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 whitespace-nowrap ml-2">
                            {dev.technology.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 flex-grow flex flex-col justify-end">
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {dev.url_repository && (
                          <Button variant="outline" size="sm" asChild className="h-8">
                            <a href={dev.url_repository} target="_blank" rel="noopener noreferrer">
                              <Code2 className="mr-2 h-3.5 w-3.5" />
                              Repositorio
                            </a>
                          </Button>
                        )}
                        {dev.links.map((link) => (
                          <Button key={link.id} variant="secondary" size="sm" asChild className="h-8">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3.5 w-3.5" />
                              {link.environment}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted col-span-full">
                  No se han registrado desarrollos para este proyecto.
                </p>
              )}
            </div>
          </TabsContent>

          {/* HORAS TAB */}
          <TabsContent value="horas" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Imputación de Horas</h2>
            </div>
            <Card className="border-muted/60 border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">Sección en construcción</h3>
                <p className="text-muted-foreground max-w-md">
                  Aquí se mostrará el registro de horas imputadas a este proyecto por los distintos miembros del equipo. Se implementará más adelante.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

