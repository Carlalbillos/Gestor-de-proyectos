import { create } from "zustand";
import { ClientService } from "../../application/services/ClientService";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import type { Client } from "../../domain/entities/client.entity";
import type { ClientQueryParams } from "../../domain/ports/ClientRepository";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const repository = new ApiClientRepository();
const service = new ClientService(repository);

interface ClientsListState extends BaseListState<Client> {
  page: number;
  setPage: (page: number) => void;
  fetchClients: () => Promise<void>;
}

export const useClientsListStore = create<ClientsListState>((set, get) => ({
  ...createBaseListSlice<Client, ClientsListState>(set, get, "fetchClients"),
  page: 1,

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
      () => service.getClients(params),
      (clients) => clients
    );
  },
}));
