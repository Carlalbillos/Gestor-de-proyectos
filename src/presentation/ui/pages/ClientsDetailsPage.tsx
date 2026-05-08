import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientDetailsStore } from "@/infrastructure/stores/client-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/components/ui/card";
import { Badge } from "@/presentation/ui/components/ui/badge";
import { Button } from "@/presentation/ui/components/ui/button";
import { Input } from "@/presentation/ui/components/ui/input";
import { Label } from "@/presentation/ui/components/ui/label";
import { useSectorsStore } from "@/infrastructure/stores/sectors.store";
import { SectorSelect } from "@/presentation/ui/components/sectors/SectorSelect";
import { updateClientSchema } from "@/presentation/ui/validators/update-client.schema";
import type { UpdateClientFormData } from "@/presentation/ui/validators/update-client.schema";
import { createContactSchema } from "@/presentation/ui/validators/create-contact.schema";
import type { CreateContactFormData } from "@/presentation/ui/validators/create-contact.schema";
import { updateContactSchema } from "@/presentation/ui/validators/update-contact.schema";
import type { UpdateContactFormData } from "@/presentation/ui/validators/update-contact.schema";
import { ArrowLeft, Loader2, XCircle, Building2, Briefcase, Users, Users2, Calendar, Mail, Phone, Star, StickyNote, Pencil, Trash2, Save, X, UserPlus } from "lucide-react";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { DetailsHeader } from "@/presentation/ui/components/ui/details-header";
import { ConfirmDialog } from "@/presentation/ui/components/ui/confirm-dialog";

export const ClientsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    client, 
    projects, 
    contacts, 
    isLoading, 
    error, 
    fetchClientDetails, 
    updateClient, 
    deleteClient, 
    changeStatus, 
    createContact, 
    updateContact, 
    deleteContact, 
    clearDetails 
  } = useClientDetailsStore();

  const { sectors, fetchSectors } = useSectorsStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
  });

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    reset: resetContact,
    formState: { errors: contactErrors },
  } = useForm<CreateContactFormData>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      isMain: false,
    },
  });

  const {
    register: registerEditContact,
    handleSubmit: handleSubmitEditContact,
    reset: resetEditContact,
    setValue: setEditContactValue,
    formState: { errors: editContactErrors },
  } = useForm<UpdateContactFormData>({
    resolver: zodResolver(updateContactSchema),
  });

  useEffect(() => {
    if (id) {
      fetchClientDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchClientDetails, clearDetails]);

  const startEditing = async () => {
    if (!client) return;
    reset({
      name: client.name,
      sectorId: client.sector?.id || "",
      isActive: client.isActive,
    });
    setIsEditing(true);

    if (sectors.length === 0) {
      fetchSectors();
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (data: UpdateClientFormData) => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updateClient(id, {
        name: data.name,
        sectorId: data.sectorId,
        isActive: data.isActive,
      });
      setIsEditing(false);
    } catch (e: any) {
      setError("name", {
        type: "server",
        message: e.message || "Error al guardar los cambios.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteClient(id);
      navigate("/clientes");
    } catch (e: any) {
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  const onContactSubmit = async (data: CreateContactFormData) => {
    if (!id) return;
    setIsSavingContact(true);
    try {
      await createContact(id, uuidv7(), data);
      setIsAddingContact(false);
      resetContact();
    } catch (e: any) {
      console.error("Error creating contact", e);
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleStartEditContact = (contact: any) => {
    setEditingContactId(contact.id);
    setEditContactValue("fullName", contact.fullName);
    setEditContactValue("email", contact.email.getValue());
    setEditContactValue("phoneNumber", contact.phoneNumber || "");
    setEditContactValue("isMain", contact.isMain);
    setEditContactValue("note", contact.note || "");
  };

  const onContactUpdateSubmit = async (data: UpdateContactFormData) => {
    if (!id || !editingContactId) return;
    setIsUpdatingContact(true);
    try {
      await updateContact(id, editingContactId, data);
      setEditingContactId(null);
      resetEditContact();
    } catch (e: any) {
      console.error("Error updating contact", e);
    } finally {
      setIsUpdatingContact(false);
    }
  };

  if (isLoading && !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando detalles del cliente...</p>
      </div>
    );
  }

  if (error && !client) {
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
      <DetailsHeader
        title={client.name}
        onBack={() => navigate("/clientes")}
        isActive={client.isActive}
        onToggleStatus={async () => {
          if (!id) return;
          setIsToggling(true);
          try {
            await changeStatus(id);
          } finally {
            setIsToggling(false);
          }
        }}
        onDelete={() => setShowDeleteConfirm(true)}
        isToggling={isToggling}
        showActions={!isEditing}
        icon={<Building2 className="h-7 w-7 text-primary" />}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Cliente"
        description={`¿Estás seguro de que deseas eliminar a ${client.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isDeleting}
      />

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-muted/60 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Datos del Cliente
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" className="shadow-sm" onClick={startEditing}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    placeholder="Nombre del cliente"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <SectorSelect
                  id="edit-sector"
                  error={errors.sectorId?.message}
                  {...register("sectorId")}
                />

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={cancelEditing} disabled={isSaving}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <>
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
              </>
            )}
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
                      variant={project.isActive ? "default" : "secondary"}
                      className={
                        project.isActive
                          ? "bg-green-500/10 text-green-700 border-green-200 shrink-0"
                          : "shrink-0"
                      }
                    >
                      {project.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    {project.startDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(project.startDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {project.teamMembers != null && (
                      <span className="flex items-center gap-1.5">
                        <Users2 className="h-3.5 w-3.5" />
                        {project.teamMembers} miembros
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
            {contacts.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-background">
                {contacts.length}
              </Badge>
            )}
          </div>
          {!isAddingContact && (
            <Button size="sm" onClick={() => setIsAddingContact(true)} className="shadow-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          )}
        </div>

        {isAddingContact && (
          <Card className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Añadir Nuevo Contacto</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAddingContact(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact(onContactSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-fullName">Nombre Completo</Label>
                    <Input
                      id="contact-fullName"
                      placeholder="Ej: Ana Martínez"
                      aria-invalid={!!contactErrors.fullName}
                      {...registerContact("fullName")}
                    />
                    {contactErrors.fullName && (
                      <p className="text-sm text-destructive">{contactErrors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Ej: ana@empresa.com"
                      aria-invalid={!!contactErrors.email}
                      {...registerContact("email")}
                    />
                    {contactErrors.email && (
                      <p className="text-sm text-destructive">{contactErrors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Teléfono (Opcional)</Label>
                    <Input
                      id="contact-phone"
                      placeholder="Ej: +34 600 000 000"
                      aria-invalid={!!contactErrors.phoneNumber}
                      {...registerContact("phoneNumber")}
                    />
                    {contactErrors.phoneNumber && (
                      <p className="text-sm text-destructive">{contactErrors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-note">Notas (Opcional)</Label>
                    <Input
                      id="contact-note"
                      placeholder="Ej: Responsable de compras"
                      aria-invalid={!!contactErrors.note}
                      {...registerContact("note")}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...registerContact("isMain")}
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5" />
                      Contacto Principal
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingContact(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" disabled={isSavingContact}>
                    {isSavingContact ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Añadiendo...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Contacto
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              editingContactId === contact.id ? (
                <Card key={contact.id} className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-2">
                  <CardContent className="p-4">
                    <form onSubmit={handleSubmitEditContact(onContactUpdateSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-contact-fullName">Nombre Completo</Label>
                          <Input
                            id="edit-contact-fullName"
                            aria-invalid={!!editContactErrors.fullName}
                            {...registerEditContact("fullName")}
                          />
                          {editContactErrors.fullName && (
                            <p className="text-sm text-destructive">{editContactErrors.fullName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-contact-email">Email</Label>
                          <Input
                            id="edit-contact-email"
                            type="email"
                            aria-invalid={!!editContactErrors.email}
                            {...registerEditContact("email")}
                          />
                          {editContactErrors.email && (
                            <p className="text-sm text-destructive">{editContactErrors.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-contact-phone">Teléfono (Opcional)</Label>
                          <Input
                            id="edit-contact-phone"
                            aria-invalid={!!editContactErrors.phoneNumber}
                            {...registerEditContact("phoneNumber")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-contact-note">Notas (Opcional)</Label>
                          <Input
                            id="edit-contact-note"
                            aria-invalid={!!editContactErrors.note}
                            {...registerEditContact("note")}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            {...registerEditContact("isMain")}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5" />
                            Principal
                          </span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setEditingContactId(null)}>
                          Cancelar
                        </Button>
                        <Button type="submit" size="sm" disabled={isUpdatingContact}>
                          {isUpdatingContact ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Actualizar
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card key={contact.id} className="border-muted/60 shadow-sm hover:border-primary/30 transition-colors group/contact">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{contact.fullName}</p>
                          {contact.isMain && (
                            <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/15">
                              <Star className="mr-1 h-3 w-3" />
                              Principal
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {contact.email.getValue()}
                          </span>
                          {contact.phoneNumber && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              {contact.phoneNumber}
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-2 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                          onClick={() => handleStartEditContact(contact)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-2 text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-colors"
                          onClick={async () => {
                            if (confirm(`¿Estás seguro de que quieres eliminar a ${contact.fullName}?`)) {
                              await deleteContact(id!, contact.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
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
