import { create } from "zustand";
import { GetClientByIdUseCase } from "@/application/use-cases/client/GetClientByIdUseCase";
import { GetClientProjectsUseCase } from "@/application/use-cases/client/GetClientProjectsUseCase";
import { GetClientContactsUseCase } from "@/application/use-cases/client/GetClientContactsUseCase";
import { UpdateClientUseCase } from "@/application/use-cases/client/UpdateClientUseCase";
import { DeleteClientUseCase } from "@/application/use-cases/client/DeleteClientUseCase";
import { ChangeClientStatusUseCase } from "@/application/use-cases/client/ChangeClientStatusUseCase";
import { CreateContactUseCase } from "@/application/use-cases/client/CreateContactUseCase";
import { UpdateContactUseCase } from "@/application/use-cases/client/UpdateContactUseCase";
import { DeleteContactUseCase } from "@/application/use-cases/client/DeleteContactUseCase";
import { SetMainContactUseCase } from "@/application/use-cases/client/SetMainContactUseCase";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import type { Client, ClientContact } from "@/domain/entities/client.entity";
import type { UpdateClientDTO } from "@/application/dto/client/UpdateClient.dto";
import type { Project } from "@/domain/entities/project.entity";

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
  setMainContact: (clientId: string, contactId: string) => Promise<void>;
  clearDetails: () => void;
}

const clientRepository = new ApiClientRepository();
const getClientByIdUseCase = new GetClientByIdUseCase(clientRepository);
const getClientProjectsUseCase = new GetClientProjectsUseCase(clientRepository);
const getClientContactsUseCase = new GetClientContactsUseCase(clientRepository);
const updateClientUseCase = new UpdateClientUseCase(clientRepository);
const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
const changeClientStatusUseCase = new ChangeClientStatusUseCase(clientRepository);
const createContactUseCase = new CreateContactUseCase(clientRepository);
const updateContactUseCase = new UpdateContactUseCase(clientRepository);
const deleteContactUseCase = new DeleteContactUseCase(clientRepository);
const setMainContactUseCase = new SetMainContactUseCase(clientRepository);

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
        getClientByIdUseCase.execute(id),
        getClientProjectsUseCase.execute(id),
        getClientContactsUseCase.execute(id),
      ]);
      set({ client, projects, contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del cliente", isLoading: false });
    }
  },

  updateClient: async (id: string, dto: UpdateClientDTO) => {
    set({ isLoading: true, error: null });
    try {
      await updateClientUseCase.execute(id, dto);
      const client = await getClientByIdUseCase.execute(id);
      set({ client, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el cliente", isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteClientUseCase.execute(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al eliminar el cliente", isLoading: false });
      throw error;
    }
  },

  changeStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await changeClientStatusUseCase.execute(id);
      const client = await getClientByIdUseCase.execute(id);
      set({ client, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar el estado del cliente", isLoading: false });
      throw error;
    }
  },

  createContact: async (clientId: string, contactId: string, contact: any) => {
    set({ isLoading: true, error: null });
    try {
      await createContactUseCase.execute(clientId, contactId, contact);
      if (contact.isMain) {
        await setMainContactUseCase.execute(clientId, contactId);
      }
      const contacts = await getClientContactsUseCase.execute(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al crear el contacto", isLoading: false });
      throw error;
    }
  },

  updateContact: async (clientId: string, contactId: string, contact: any) => {
    set({ isLoading: true, error: null });
    try {
      await updateContactUseCase.execute(clientId, contactId, contact);
      if (contact.isMain) {
        await setMainContactUseCase.execute(clientId, contactId);
      }
      const contacts = await getClientContactsUseCase.execute(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el contacto", isLoading: false });
      throw error;
    }
  },

  deleteContact: async (clientId: string, contactId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteContactUseCase.execute(clientId, contactId);
      const contacts = await getClientContactsUseCase.execute(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al eliminar el contacto", isLoading: false });
      throw error;
    }
  },

  setMainContact: async (clientId: string, contactId: string) => {
    set({ isLoading: true, error: null });
    try {
      await setMainContactUseCase.execute(clientId, contactId);
      const contacts = await getClientContactsUseCase.execute(clientId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al marcar el contacto como principal", isLoading: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({ client: null, projects: [], contacts: [], error: null, isLoading: false });
  },
}));
