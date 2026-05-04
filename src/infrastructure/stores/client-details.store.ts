import { create } from "zustand";
import type { Client, ClientContact } from "@/domain/entities/client.entity";
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

  clearDetails: () => {
    set({ client: null, projects: [], contacts: [], error: null, isLoading: false });
  },
}));
