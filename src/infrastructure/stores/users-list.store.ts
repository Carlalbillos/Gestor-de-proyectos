import { create } from "zustand";
import { UserService } from "../../application/services/UserService";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import type { User } from "../../domain/entities/user.entity";
import type { UserQueryParams } from "../../domain/ports/UserRepository";
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
    set({ filterRole, page: 1 });
    get().fetchUsers();
  },

  fetchUsers: async () => {
    const { page, search, filterStatus, filterRole } = get();

    const params: UserQueryParams = {
      page,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterStatus === "active") {
      params.isActive = true;
    } else if (filterStatus === "inactive") {
      params.isActive = false;
    }

    if (filterRole === "admin") {
      params.role = "ROLE_ADMIN";
    } else if (filterRole === "user") {
      params.role = "ROLE_EMPLOYEE";
    }

    await handleListFetch<User, UsersListState>(
      set,
      get,
      () => service.getUsers(params),
      (users, state) => {
        let filtered = users;

        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filtered = filtered.filter(u => 
            u.name.toLowerCase().includes(term) || 
            u.surname.toLowerCase().includes(term) ||
            u.email.getValue().toLowerCase().includes(term)
          );
        }

        if (state.filterStatus !== "all") {
          filtered = filtered.filter(u => 
            u.isActive === (state.filterStatus === "active")
          );
        }

        if (state.filterRole !== "all") {
          const roleToMatch = state.filterRole === "admin" ? "ROLE_ADMIN" : "ROLE_EMPLOYEE";
          filtered = filtered.filter(u => u.role === roleToMatch);
        }

        return filtered;
      }
    );
  },
}));
