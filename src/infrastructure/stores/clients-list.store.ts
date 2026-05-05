import { create } from "zustand";
import { ClientService } from "../../application/services/client.service";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import type { Client } from "../../domain/entities/client.entity";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const repository = new ApiClientRepository();
const service = new ClientService(repository);

interface ClientsListState extends BaseListState<Client> {
  fetchClients: () => Promise<void>;
}

export const useClientsListStore = create<ClientsListState>((set, get) => ({
  ...createBaseListSlice<Client, ClientsListState>(set, get, "fetchClients"),

  fetchClients: async () => {
    await handleListFetch<Client, ClientsListState>(
      set,
      get,
      () => service.getClients(),
      (clients, state) => {
        let filteredClients = clients;

        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filteredClients = filteredClients.filter((client) =>
            client.name.toLowerCase().includes(term)
          );
        }

        if (state.filterStatus !== "all") {
          filteredClients = filteredClients.filter((client) => {
            const clientIsActive = Boolean(client.isActive);
            return clientIsActive === (state.filterStatus === "active");
          });
        }

        return filteredClients;
      }
    );
  },
}));
