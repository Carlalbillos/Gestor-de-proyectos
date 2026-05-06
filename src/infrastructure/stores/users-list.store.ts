import { create } from "zustand";
import { UserService } from "../../application/services/UserService";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import { isAdmin } from "@/presentation/ui/lib/roleChecker";
import type { User } from "../../domain/entities/user.entity";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const repository = new ApiUserRepository();
const service = new UserService(repository);

interface UsersListState extends BaseListState<User> {
  filterRole: "all" | "admin" | "user";
  setFilterRole: (filterRole: "all" | "admin" | "user") => void;
  fetchUsers: () => Promise<void>;
}

export const useUsersListStore = create<UsersListState>((set, get) => ({
  ...createBaseListSlice<User, UsersListState>(set, get, "fetchUsers"),
  filterRole: "all",

  setFilterRole: (filterRole) => {
    set({ filterRole });
    get().fetchUsers();
  },

  fetchUsers: async () => {
    await handleListFetch<User, UsersListState>(
      set,
      get,
      () => service.getUsers(),
      (users, state) => {
        let filteredUsers = users;

        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filteredUsers = filteredUsers.filter((u) =>
            `${u.name} ${u.surname}`.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
          );
        }

        if (state.filterStatus !== "all") {
          filteredUsers = filteredUsers.filter((u) => {
            const userIsActive = Boolean(u.isActive);
            return userIsActive === (state.filterStatus === "active");
          });
        }

        if (state.filterRole !== "all") {
          filteredUsers = filteredUsers.filter((u) =>
            state.filterRole === "admin" ? isAdmin(u) : !isAdmin(u)
          );
        }

        return filteredUsers;
      }
    );
  },
}));
