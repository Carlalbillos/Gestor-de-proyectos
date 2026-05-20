import { create } from "zustand";
import { container } from "@/infrastructure/di/container";
import type { User } from "@/domain/entities/user.entity";
import type { UserQueryParams } from "@/domain/ports/UserRepository";
import { createBaseListSlice, handleListFetch } from "@/presentation/stores/factories/list-factory";
import type { BaseListState } from "@/presentation/stores/factories/list-factory";
import type { CreateUserDTO } from "@/domain/ports/UserRepository";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";

const { getUsersUseCase, createUserUseCase } = container;

interface UsersListState extends BaseListState<User> {
  filterRole: "all" | "admin" | "user";
  isSaving: boolean;
  setFilterRole: (filterRole: "all" | "admin" | "user") => void;
  fetchUsers: () => Promise<void>;
  addUser: (user: CreateUserDTO) => Promise<void>;
}

export const useUsersListStore = create<UsersListState>((set, get) => ({
  ...createBaseListSlice<User, UsersListState>(set, get, "fetchUsers"),
  filterRole: "all",
  isSaving: false,

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
      () => getUsersUseCase.execute(params),
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
          filtered = filtered.filter(u => u.role === state.filterRole);
        }

        return filtered;
      },
      {
        authorize: () => {
          const user = useAuthStore.getState().user;
          return !!user && isAdmin(user);
        },
      }
    );

  },

  addUser: async (user: CreateUserDTO) => {
    set({ isSaving: true });
    try {
      await createUserUseCase.execute(user);
      await get().fetchUsers();
    } finally {
      set({ isSaving: false });
    }
  },
}));
