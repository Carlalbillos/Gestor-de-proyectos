import { create } from "zustand";

import { UserService } from "../../application/services/user.service";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import { useAuthStore } from "./auth.store";
import { isAdmin } from "../ui/lib/roleChecker";

import type { User } from "../../domain/entities/user.entity";

const repository = new ApiUserRepository();
const service = new UserService(repository);

interface UsersListState {
  users: User[];
  total: number;
  isLoading: boolean;
  error: string | null;
  search: string;
  filterStatus: "all" | "active" | "inactive";
  filterRole: "all" | "admin" | "user";

  setSearch: (search: string) => void;
  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => void;
  setFilterRole: (filterRole: "all" | "admin" | "user") => void;
  fetchUsers: () => Promise<void>;
}

export const useUsersListStore = create<UsersListState>((set, get) => ({
  users: [],
  total: 0,
  isLoading: false,
  error: null,
  search: "",
  filterStatus: "all",
  filterRole: "all",

  setSearch: (search: string) => {
    set({ search });
    get().fetchUsers();
  },

  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
    set({ filterStatus });
    get().fetchUsers();
  },

  setFilterRole: (filterRole: "all" | "admin" | "user") => {
    set({ filterRole });
    get().fetchUsers();
  },

  fetchUsers: async () => {
    const user = useAuthStore.getState().user;
    const isAdminUser = isAdmin(user);

    set({ isLoading: true, error: null });
    try {
      if (!user || !isAdminUser) {
        set({ users: [], total: 0, isLoading: false, error: "Sin permisos para acceder" });
        return;
      }

      let allUsers = await service.getUsers();
      const { search, filterStatus, filterRole } = get();

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        allUsers = allUsers.filter((u) =>
          `${u.name} ${u.surname}`.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
        );
      }

      if (filterStatus !== "all") {
        allUsers = allUsers.filter((u) => {
          const userIsActive = Boolean(u.is_active);
          return userIsActive === (filterStatus === "active");
        });
      }

      if (filterRole !== "all") {
        allUsers = allUsers.filter((u) =>
          u.role.toLowerCase() === filterRole
        );
      }

      set({ users: allUsers, total: allUsers.length, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de usuarios" });
    }
  },
}));
