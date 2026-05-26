import { create } from "zustand";
import { container } from "@/infrastructure/di/container";
import type { Client } from "@/domain/entities/client.entity";
import type { ClientQueryParams, CreateClientDTO, UpdateClientDTO } from "@/domain/ports/ClientRepository";
import { createBaseListSlice, handleListFetch } from "@/presentation/stores/factories/list-factory";
import type { BaseListState } from "@/presentation/stores/factories/list-factory";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";

const { getClientsUseCase, createClientUseCase, updateClientUseCase, deleteClientUseCase } = container;

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
      (clients) => clients,
      {
        authorize: () => {
          const user = useAuthStore.getState().user;
          return !!user && isAdmin(user);
        },
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
