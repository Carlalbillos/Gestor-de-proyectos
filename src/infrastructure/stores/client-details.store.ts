import { create } from "zustand";
import type { Client, ClientContact, UpdateClientDTO } from "@/domain/entities/client.entity";
import type { Project } from "@/domain/entities/project.entity";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/client.service";

interface ClientDetailsState {
  client: Client | null;
  projects: Project[];
  contacts: ClientContact[];
  isLoading: boolean;
  error: string | null;
  fetchClientDetails: (id: string) => Promise<void>;
  updateClient: (id: string, dto: UpdateClientDTO) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  clearDetails: () => void;
}

const clientRepository = new ApiClientRepository();
const clientService = new ClientService(clientRepository);

export const useClientDetailsStore = create<ClientDetailsState>((set) => ({
  client: null,
  projects: [],
  contacts: [],
  isLoading: false,
  error: null,

  fetchClientDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [client, projects, contacts] = await Promise.all([
        clientService.getClientById(id),
        clientService.getClientProjects(id),
        clientService.getClientContacts(id),
      ]);
      set({ client, projects, contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del cliente", isLoading: false });
    }
  },

  updateClient: async (id: string, dto: UpdateClientDTO) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.updateClient(id, dto);
      const client = await clientService.getClientById(id);
      set({ client, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el cliente", isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.deleteClient(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al eliminar el cliente", isLoading: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({ client: null, projects: [], contacts: [], error: null, isLoading: false });
  },
}));
