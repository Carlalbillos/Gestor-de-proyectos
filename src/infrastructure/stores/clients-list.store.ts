import { create } from "zustand";

import { ClientService } from "../../application/services/client.service";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import { useAuthStore } from "./auth.store";
import { isAdmin } from "../ui/lib/roleChecker";

import type { Client } from "../../domain/entities/client.entity";

const repository = new ApiClientRepository();
const service = new ClientService(repository);

interface ClientsListState {
  clients: Client[];
  total: number;
  isLoading: boolean;
  error: string | null;
  search: string;
  filterStatus: "all" | "active" | "inactive";

  setSearch: (search: string) => void;
  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => void;
  fetchClients: () => Promise<void>;
}

export const useClientsListStore = create<ClientsListState>((set, get) => ({
  clients: [],
  total: 0,
  isLoading: false,
  error: null,
  search: "",
  filterStatus: "all",

  setSearch: (search: string) => {
    set({ search });
    get().fetchClients();
  },

  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
    set({ filterStatus });
    get().fetchClients();
  },

  fetchClients: async () => {
    const { filterStatus, search } = get();
    const user = useAuthStore.getState().user;
    const isAdminUser = isAdmin(user);

    set({ isLoading: true, error: null });
    try {
      if (!user || !isAdminUser) {
        set({ clients: [], total: 0, isLoading: false, error: "Sin permisos para acceder" });
        return;
      }

      let allClients = await service.getClients();

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        allClients = allClients.filter((client) =>
          client.name.toLowerCase().includes(term)
        );
      }

      if (filterStatus !== "all") {
        allClients = allClients.filter((client) => {
          const clientIsActive = Boolean(client.is_active);
          return clientIsActive === (filterStatus === "active");
        });
      }

      set({ clients: allClients, total: allClients.length, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de clientes" });
    }
  },
}));
