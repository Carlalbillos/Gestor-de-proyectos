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
    const { page, limit, search, filterStatus, filterRole } = get();

    const params: UserQueryParams = {
      page,
    };

    // Only send limit if it's not the default (20)
    if (limit !== 20) {
      params.limit = limit;
    }

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
      (users) => users // Server handles everything
    );
  },
}));
