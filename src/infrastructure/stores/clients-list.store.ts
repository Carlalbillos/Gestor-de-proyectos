import { create } from "zustand";
import { GetClientsUseCase } from "../../application/use-cases/client/GetClientsUseCase";
import { CreateClientUseCase } from "../../application/use-cases/client/CreateClientUseCase";
import { UpdateClientUseCase } from "../../application/use-cases/client/UpdateClientUseCase";
import { DeleteClientUseCase } from "../../application/use-cases/client/DeleteClientUseCase";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import type { CreateClientDTO } from "../../application/dto/client/CreateClient.dto";
import type { UpdateClientDTO } from "../../application/dto/client/UpdateClient.dto";
import type { Client } from "../../domain/entities/client.entity";
import type { ClientQueryParams } from "../../domain/ports/ClientRepository";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const repository = new ApiClientRepository();
const getClientsUseCase = new GetClientsUseCase(repository);
const createClientUseCase = new CreateClientUseCase(repository);
const updateClientUseCase = new UpdateClientUseCase(repository);
const deleteClientUseCase = new DeleteClientUseCase(repository);

interface ClientsListState extends BaseListState<Client> {
  page: number;
  isSaving: boolean;
  setPage: (page: number) => void;
  fetchClients: () => Promise<void>;
  addClient: (client: CreateClientDTO) => Promise<void>;
  updateClient: (id: string, client: UpdateClientDTO) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientsListStore = create<ClientsListState>((set, get) => ({
  ...createBaseListSlice<Client, ClientsListState>(set, get, "fetchClients"),
  page: 1,
  isSaving: false,

  setPage: (page: number) => {
    set({ page });
    get().fetchClients();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchClients();
  },

  setFilterStatus: (filterStatus) => {
    set({ filterStatus, page: 1 });
    get().fetchClients();
  },

  fetchClients: async () => {
    const { page, search, filterStatus } = get();
    const params: ClientQueryParams = { page };

    if (filterStatus === "active") {
      params.isActive = true;
    } else if (filterStatus === "inactive") {
      params.isActive = false;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    await handleListFetch<Client, ClientsListState>(
      set,
      get,
      () => getClientsUseCase.execute(params),
      (clients, state) => {
        let filtered = clients;

        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(term)
          );
        }

        if (state.filterStatus !== "all") {
          filtered = filtered.filter(c => 
            c.isActive === (state.filterStatus === "active")
          );
        }

        return filtered;
      }
    );
  },

  addClient: async (client: CreateClientDTO) => {
    set({ isSaving: true });
    try {
      await createClientUseCase.execute(client);
      await get().fetchClients();
    } finally {
      set({ isSaving: false });
    }
  },

  updateClient: async (id: string, client: UpdateClientDTO) => {
    set({ isSaving: true });
    try {
      await updateClientUseCase.execute(id, client);
      await get().fetchClients();
    } finally {
      set({ isSaving: false });
    }
  },

  deleteClient: async (id: string) => {
    set({ isSaving: true });
    try {
      await deleteClientUseCase.execute(id);
      await get().fetchClients();
    } finally {
      set({ isSaving: false });
    }
  },
}));
