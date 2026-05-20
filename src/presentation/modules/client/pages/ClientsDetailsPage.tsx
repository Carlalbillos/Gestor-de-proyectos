import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useClientDetailsStore } from "@/presentation/modules/client/stores/client-details.store";
import { useSectorsStore } from "@/presentation/modules/sector/stores/sectors.store";
import {
  Building2,
  Briefcase,
  Users,
  Info
} from "lucide-react";
import { PageLoader, DetailError, DetailsHeader, ConfirmDialog, Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/ui";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { ClientInfoTab } from "@/presentation/modules/client/components/ClientInfoTab";
import { ClientProjectsTab } from "@/presentation/modules/client/components/ClientProjectsTab";
import { ClientContactsTab } from "@/presentation/modules/client/components/ClientContactsTab";

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

  const deleteConfirm = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientDetails(id);
    }
    return () => clearDetails();
  }, [id, fetchClientDetails, clearDetails]);

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
        showActions={true}
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
          <ClientInfoTab 
            client={client} 
            contacts={contacts} 
            sectors={sectors}
            fetchSectors={fetchSectors}
            onUpdate={(data) => updateClient(id!, data)}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-0 focus-visible:ring-0">
          <ClientProjectsTab projects={projects} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-0 focus-visible:ring-0">
          <ClientContactsTab 
            clientId={id!}
            contacts={contacts}
            onCreateContact={createContact}
            onUpdateContact={updateContact}
            onDeleteContact={deleteContact}
            onSetMainContact={setMainContact}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
