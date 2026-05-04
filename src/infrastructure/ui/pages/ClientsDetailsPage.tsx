import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useClientDetailsStore } from "@/infrastructure/stores/client-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/ui/card";
import { Badge } from "@/infrastructure/ui/components/ui/badge";
import { Button } from "@/infrastructure/ui/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Building2,
  Briefcase,
  Users,
  Users2,
  Calendar,
  Mail,
  Phone,
  Star,
  StickyNote,
} from "lucide-react";

export const ClientsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, projects, contacts, isLoading, error, fetchClientDetails, clearDetails } =
    useClientDetailsStore();

  useEffect(() => {
    if (id) {
      fetchClientDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchClientDetails, clearDetails]);

  if (isLoading && !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del cliente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 mt-8">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Error al cargar el cliente</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/clientes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!client) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate("/clientes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{client.name}</h1>
              </div>
            </div>
            <Badge
              variant={client.is_active ? "default" : "secondary"}
              className={
                client.is_active
                  ? "bg-green-500/10 text-green-700 border-green-200"
                  : "bg-muted text-muted-foreground"
              }
            >
              {client.is_active ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Activo
                </div>
              ) : (
                "Inactivo"
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-muted/60 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Nombre</p>
                <p className="font-bold text-foreground">{client.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Sector</p>
                <p className="font-bold text-foreground">{client.sector?.name || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Proyectos Activos</h2>
          {projects.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-background">
              {projects.length}
            </Badge>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card
                key={project.id}
                className="border-muted/50 hover:border-primary/30 transition-colors shadow-none bg-card/50 cursor-pointer"
                onClick={() => navigate(`/proyectos/${project.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description || "Sin descripción"}
                      </p>
                    </div>
                    <Badge
                      variant={project.is_active ? "default" : "secondary"}
                      className={
                        project.is_active
                          ? "bg-green-500/10 text-green-700 border-green-200 shrink-0"
                          : "shrink-0"
                      }
                    >
                      {project.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    {project.start_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(project.start_date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {project.team_members != null && (
                      <span className="flex items-center gap-1.5">
                        <Users2 className="h-3.5 w-3.5" />
                        {project.team_members} miembros
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted sm:col-span-2">
              No hay proyectos asociados a este cliente.
            </p>
          )}
        </div>
      </section>

      {/* Contacts Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
          {contacts.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-background">
              {contacts.length}
            </Badge>
          )}
        </div>
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <Card key={contact.id} className="border-muted/60 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{contact.full_name}</p>
                        {contact.is_main && (
                          <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/15">
                            <Star className="mr-1 h-3 w-3" />
                            Principal
                          </Badge>
                        )}
                        <Badge
                          variant={contact.is_active ? "default" : "secondary"}
                          className={
                            contact.is_active
                              ? "bg-green-500/10 text-green-700 border-green-200"
                              : ""
                          }
                        >
                          {contact.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {contact.email}
                        </span>
                        {contact.phone_number && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {contact.phone_number}
                          </span>
                        )}
                      </div>
                      {contact.note && (
                        <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1">
                          <StickyNote className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span>{contact.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed border-muted">
              No hay contactos registrados para este cliente.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
