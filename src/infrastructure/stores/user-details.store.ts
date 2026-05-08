import { create } from "zustand";
import { UserService } from "../../application/services/UserService";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import type { User, TimeEntry } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";

const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

interface UserDetailsState {
  user: User | null;
  projects: Project[];
  timeEntries: TimeEntry[];
  totalHours: number;
  isLoading: boolean;
  error: string | null;
  fetchUserDetails: (id: string) => Promise<void>;
  updateUser: (id: string, data: any) => Promise<void>;
  changeActivityUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  adminChangePassword: (id: string, password: string) => Promise<void>;
  clearDetails: () => void;
}

export const useUserDetailsStore = create<UserDetailsState>((set) => ({
  user: null,
  projects: [],
  timeEntries: [],
  totalHours: 0,
  isLoading: false,
  error: null,

  fetchUserDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [user, projects, timeEntriesResponse] = await Promise.all([
        userService.getUserProfile(id),
        userService.getUserProjects(id),
        userService.getUserTimeEntries(id),
      ]);
      set({
        user,
        projects,
        timeEntries: timeEntriesResponse.data,
        totalHours: timeEntriesResponse.totalHours,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del usuario", isLoading: false });
    }
  },

  updateUser: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await userService.updateUser(id, data);
      const updatedUser = await userService.getUserProfile(id);
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el usuario", isLoading: false });
      throw error;
    }
  },

  changeActivityUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.changeActivityUser(id);
      const updatedUser = await userService.getUserProfile(id);
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar el estado del usuario", isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al borrar el usuario", isLoading: false });
      throw error;
    }
  },

  adminChangePassword: async (id: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.adminChangePassword(id, { newPassword: password });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar la contraseña", isLoading: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({ user: null, projects: [], timeEntries: [], totalHours: 0, error: null, isLoading: false });
  },
}));
