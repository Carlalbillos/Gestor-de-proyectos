import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, Label, Input, DetailItem, EditButton, FormActions } from "@/presentation/ui";
import { Building2, Briefcase, Star, Mail, Phone } from "lucide-react";
import { SectorSelect } from "@/presentation/modules/sector/components/SectorSelect";
import { updateClientSchema, type UpdateClientFormData } from "@/presentation/modules/client/schemas/updateClientSchema";
import type { Client, ClientContact } from "@/domain/entities/client.entity";
import type { Sector } from "@/domain/entities/sector.entity";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { useState } from "react";

interface ClientInfoTabProps {
  client: Client;
  contacts: ClientContact[];
  sectors: Sector[];
  fetchSectors: () => void;
  onUpdate: (data: UpdateClientFormData) => Promise<void>;
}

export const ClientInfoTab = ({ 
  client, 
  contacts, 
  sectors, 
  fetchSectors, 
  onUpdate 
}: ClientInfoTabProps) => {
  const editing = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
  });

  const startEditing = () => {
    reset({
      name: client.name,
      isActive: client.isActive,
    });
    editing.open();
    if (sectors.length === 0) {
      fetchSectors();
    }
  };

  const onSubmit = async (data: UpdateClientFormData) => {
    setIsSaving(true);
    try {
      await onUpdate(data);
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

  const mainContact = contacts.find(c => c.isMain);

  return (
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
              <FormActions isSaving={isSaving} onCancel={editing.close} />
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
          {mainContact ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-200">
                  <Star className="h-5 w-5 text-amber-600 fill-amber-500/20" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{mainContact.fullName}</p>
                  <p className="text-xs text-muted-foreground">Responsable principal</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground truncate">{mainContact.email ? mainContact.email.getValue() : "Sin email"}</span>
                </div>
                {mainContact.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{mainContact.phoneNumber.getValue()}</span>
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
  );
};
