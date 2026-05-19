import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Badge } from "@/presentation/components/ui/badge";
import { 
  UserPlus, 
  X, 
  Save, 
  Loader2, 
  Star, 
  Mail, 
  Phone 
} from "lucide-react";
import { createContactSchema, type CreateContactFormData } from "@/presentation/schemas/client/createContactSchema";
import { updateContactSchema, type UpdateContactFormData } from "@/presentation/schemas/client/updateContactSchema";
import type { ClientContact } from "@/domain/entities/client.entity";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { EditButton } from "@/presentation/components/shared/edit-button";
import { DeleteButton } from "@/presentation/components/shared/delete-button";
import { uuidv7 } from "@/presentation/ui/lib/uuid";

interface ClientContactsTabProps {
  clientId: string;
  contacts: ClientContact[];
  onCreateContact: (id: string, contactId: string, data: CreateContactFormData) => Promise<void>;
  onUpdateContact: (id: string, contactId: string, data: UpdateContactFormData) => Promise<void>;
  onDeleteContact: (id: string, contactId: string) => Promise<void>;
  onSetMainContact: (id: string, contactId: string) => Promise<void>;
}

export const ClientContactsTab = ({
  clientId,
  contacts,
  onCreateContact,
  onUpdateContact,
  onDeleteContact,
  onSetMainContact,
}: ClientContactsTabProps) => {
  const addingContact = useDisclosure();
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);

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

  const onContactSubmit = async (data: CreateContactFormData) => {
    setIsSavingContact(true);
    try {
      await onCreateContact(clientId, uuidv7(), data);
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

  const handleStartEditContact = (contact: ClientContact) => {
    setEditingContactId(contact.id);
    setEditContactValue("fullName", contact.fullName);
    setEditContactValue("email", contact.email ? contact.email.getValue() : "");
    setEditContactValue("phoneNumber", contact.phoneNumber || "");
    setEditContactValue("isMain", contact.isMain);
    setEditContactValue("note", contact.note || "");
  };

  const onContactUpdateSubmit = async (data: UpdateContactFormData) => {
    if (!editingContactId) return;
    setIsUpdatingContact(true);
    try {
      await onUpdateContact(clientId, editingContactId, data);
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

  return (
    <div className="space-y-6">
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
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {contact.email ? contact.email.getValue() : "Sin email"}</span>
                      {contact.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {contact.phoneNumber}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!contact.isMain && <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => onSetMainContact(clientId, contact.id)}><Star className="h-4 w-4" /></Button>}
                    <EditButton label="" onClick={() => handleStartEditContact(contact)} />
                    <DeleteButton label="" onClick={async () => { if (confirm(`¿Eliminar a ${contact.fullName}?`)) await onDeleteContact(clientId, contact.id); }} />
                  </div>
                </CardContent>
              </Card>
            )
          ))
        ) : (
          <p className="text-muted-foreground italic text-center py-8 bg-muted/20 rounded-lg border border-dashed">No hay contactos registrados.</p>
        )}
      </div>
    </div>
  );
};
