import { create } from "zustand";
import type { Client, ClientContact } from "@/domain/entities/client.entity";
import type { UpdateClientDTO } from "@/application/dto/client.dto";
import type { Project } from "@/domain/entities/project.entity";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/ClientService";

interface ClientDetailsState {
  client: Client | null;
  projects: Project[];
  contacts: ClientContact[];
  isLoading: boolean;
  error: string | null;
  fetchClientDetails: (id: string) => Promise<void>;
  updateClient: (id: string, dto: UpdateClientDTO) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  changeStatus: (id: string) => Promise<void>;
  createContact: (clientId: string, contactId: string, contact: any) => Promise<void>;
  updateContact: (clientId: string, contactId: string, contact: any) => Promise<void>;
  deleteContact: (clientId: string, contactId: string) => Promise<void>;
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

  changeStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.changeStatus(id);
      const client = await clientService.getClientById(id);
      set({ client, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar el estado del cliente", isLoading: false });
      throw error;
    }
  },

  createContact: async (clientId: string, contactId: string, contact: any) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.createContact(clientId, contactId, contact);
      const contacts = await clientService.getClientContacts(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al crear el contacto", isLoading: false });
      throw error;
    }
  },

  updateContact: async (clientId: string, contactId: string, contact: any) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.updateContact(clientId, contactId, contact);
      const contacts = await clientService.getClientContacts(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el contacto", isLoading: false });
      throw error;
    }
  },

  deleteContact: async (clientId: string, contactId: string) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.deleteContact(clientId, contactId);
      const contacts = await clientService.getClientContacts(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al eliminar el contacto", isLoading: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({ client: null, projects: [], contacts: [], error: null, isLoading: false });
  },
}));
