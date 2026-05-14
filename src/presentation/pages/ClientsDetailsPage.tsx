import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientDetailsStore } from "@/presentation/stores/client-details.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useSectorsStore } from "@/presentation/stores/sectors.store";
import { SectorSelect } from "@/presentation/components/sectors/SectorSelect";
import { updateClientSchema } from "@/presentation/schemas/client/updateClientSchema";
import type { UpdateClientFormData } from "@/presentation/schemas/client/updateClientSchema";
import { createContactSchema } from "@/presentation/schemas/client/createContactSchema";
import type { CreateContactFormData } from "@/presentation/schemas/client/createContactSchema";
import { updateContactSchema } from "@/presentation/schemas/client/updateContactSchema";
import type { UpdateContactFormData } from "@/presentation/schemas/client/updateContactSchema";
import {
  Loader2,
  Building2,
  Briefcase,
  Users,
  Mail,
  Phone,
  Star,
  StickyNote,
  Save,
  X,
  UserPlus,
  Info
} from "lucide-react";
import { PageLoader } from "@/presentation/components/shared/page-loader";
import { DetailError } from "@/presentation/components/shared/detail-error";
import { uuidv7 } from "@/presentation/ui/lib/uuid";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { DetailsHeader } from "@/presentation/components/shared/details-header";
import { ConfirmDialog } from "@/presentation/components/shared/confirm-dialog";
import { DetailItem } from "@/presentation/components/shared/detail-item";
import { EditButton } from "@/presentation/components/shared/edit-button";
import { DeleteButton } from "@/presentation/components/shared/delete-button";
import { FormActions } from "@/presentation/components/shared/form-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";

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
    setMainContact,
    clearDetails
  } = useClientDetailsStore();

  const { sectors, fetchSectors } = useSectorsStore();

  const editing = useDisclosure();
  const deleteConfirm = useDisclosure();
  const addingContact = useDisclosure();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
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
    setError: setErrorContact,
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
    setError: setErrorEditContact,
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
      isActive: client.isActive,
    });
    editing.open();

    if (sectors.length === 0) {
      fetchSectors();
    }
  };

  const cancelEditing = () => {
    editing.close();
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
      editing.close();
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
      deleteConfirm.close();
      setIsDeleting(false);
    }
  };

  const onContactSubmit = async (data: CreateContactFormData) => {
    if (!id) return;
    setIsSavingContact(true);
    try {
      await createContact(id, uuidv7(), data);
      addingContact.close();
      resetContact();
    } catch (e: any) {
      setErrorContact("email", {
        type: "server",
        message: e.message || "Error al crear el contacto.",
      });
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
      setErrorEditContact("email", {
        type: "server",
        message: e.message || "Error al actualizar el contacto.",
      });
    } finally {
      setIsUpdatingContact(false);
    }
  };

  if (isLoading && !client) {
    return <PageLoader variant="detail" message="Cargando detalles del cliente..." />;
  }

  if (error && !client) {
    return (
      <DetailError
        message={error}
        title="Error al cargar el cliente"
        backLabel="Volver a Clientes"
        onBack={() => navigate("/clientes")}
      />
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
        onDelete={deleteConfirm.open}
        isToggling={isToggling}
        showActions={!editing.isOpen}
        icon={<Building2 className="h-7 w-7 text-primary" />}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={handleDelete}
        title="Eliminar Cliente"
        description={`¿Estás seguro de que deseas eliminar a ${client.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isDeleting}
      />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-8">
          <TabsTrigger value="info" className="flex gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Información</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Proyectos</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Contactos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-0 focus-visible:ring-0">
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {/* DATA CARD */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Datos del Cliente
                </CardTitle>
                {!editing.isOpen && <EditButton onClick={startEditing} />}
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {editing.isOpen ? (
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
                    <FormActions isSaving={isSaving} onCancel={cancelEditing} />
                  </form>
                ) : (
                  <>
                    <DetailItem label="Nombre" value={client.name} icon={<Building2 />} />
                    <DetailItem label="Sector" value={client.sector?.name} icon={<Briefcase />} iconColor="bg-blue-500/10 text-blue-600" />
                  </>
                )}
              </CardContent>
            </Card>

            {/* MAIN CONTACT CARD */}
            <Card className="border-muted/60 shadow-sm overflow-hidden bg-gradient-to-br from-card to-muted/5">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Contacto Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {contacts.find(c => c.isMain) ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-200">
                        <Star className="h-5 w-5 text-amber-600 fill-amber-500/20" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{contacts.find(c => c.isMain)?.fullName}</p>
                        <p className="text-xs text-muted-foreground">Responsable principal</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground truncate">{contacts.find(c => c.isMain)?.email.getValue()}</span>
                      </div>
                      {contacts.find(c => c.isMain)?.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{contacts.find(c => c.isMain)?.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground italic">No hay un contacto principal definido.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-0 focus-visible:ring-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Proyectos Activos</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="group border-muted/50 hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</p>
                        <Badge variant={project.isActive ? "default" : "secondary"}>
                          {project.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {project.description || "Sin descripción disponible."}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic col-span-full text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                  No hay proyectos asociados.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-0 focus-visible:ring-0 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            </div>
            {!addingContact.isOpen && (
              <Button size="sm" onClick={addingContact.open}>
                <UserPlus className="mr-2 h-4 w-4" /> Nuevo Contacto
              </Button>
            )}
          </div>

          {addingContact.isOpen && (
            <Card className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Añadir Nuevo Contacto</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addingContact.close}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitContact(onContactSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-fullName">Nombre Completo</Label>
                      <Input id="contact-fullName" {...registerContact("fullName")} />
                      {contactErrors.fullName && <p className="text-xs text-destructive">{contactErrors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input id="contact-email" type="email" {...registerContact("email")} />
                      {contactErrors.email && <p className="text-xs text-destructive">{contactErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phoneNumber">Teléfono</Label>
                      <Input id="contact-phoneNumber" placeholder="+34 000 000 000" {...registerContact("phoneNumber")} />
                      {contactErrors.phoneNumber && <p className="text-xs text-destructive">{contactErrors.phoneNumber.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-note">Nota / Observaciones</Label>
                    <Input id="contact-note" placeholder="Información adicional del contacto..." {...registerContact("note")} />
                    {contactErrors.note && <p className="text-xs text-destructive">{contactErrors.note.message}</p>}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={addingContact.close}>Cancelar</Button>
                    <Button type="submit" size="sm" disabled={isSavingContact}>
                      {isSavingContact ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Guardar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                editingContactId === contact.id ? (
                  <Card key={contact.id} className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4">
                      <form onSubmit={handleSubmitEditContact(onContactUpdateSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-contact-fullName">Nombre Completo</Label>
                            <Input id="edit-contact-fullName" {...registerEditContact("fullName")} />
                            {editContactErrors.fullName && <p className="text-xs text-destructive">{editContactErrors.fullName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-contact-email">Email</Label>
                            <Input id="edit-contact-email" type="email" {...registerEditContact("email")} />
                            {editContactErrors.email && <p className="text-xs text-destructive">{editContactErrors.email.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-contact-phoneNumber">Teléfono</Label>
                            <Input id="edit-contact-phoneNumber" {...registerEditContact("phoneNumber")} />
                            {editContactErrors.phoneNumber && <p className="text-xs text-destructive">{editContactErrors.phoneNumber.message}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-contact-note">Nota / Observaciones</Label>
                          <Input id="edit-contact-note" {...registerEditContact("note")} />
                        </div>
                        <div className="flex items-center space-x-2 py-2">
                          <input
                            type="checkbox"
                            id="edit-contact-isMain"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            {...registerEditContact("isMain")}
                          />
                          <Label htmlFor="edit-contact-isMain" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Contacto principal
                          </Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setEditingContactId(null)}>Cancelar</Button>
                          <Button type="submit" size="sm" disabled={isUpdatingContact}>
                            {isUpdatingContact ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Actualizar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={contact.id} className="border-muted/60 shadow-sm hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{contact.fullName}</p>
                          {contact.isMain && <Badge className="bg-amber-500/10 text-amber-700"><Star className="mr-1 h-3 w-3" /> Principal</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {contact.email.getValue()}</span>
                          {contact.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {contact.phoneNumber}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!contact.isMain && <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => setMainContact(id!, contact.id)}><Star className="h-4 w-4" /></Button>}
                        <EditButton label="" onClick={() => handleStartEditContact(contact)} />
                        <DeleteButton label="" onClick={async () => { if (confirm(`¿Eliminar a ${contact.fullName}?`)) await deleteContact(id!, contact.id); }} />
                      </div>
                    </CardContent>
                  </Card>
                )
              ))
            ) : (
              <p className="text-muted-foreground italic text-center py-8 bg-muted/20 rounded-lg border border-dashed">No hay contactos registrados.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
