import { create } from "zustand";
import { UserService } from "../../application/services/user.service";
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
        totalHours: timeEntriesResponse.total_hours,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del usuario", isLoading: false });
    }
  },

  adminChangePassword: async (id: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.adminChangePassword(id, { new_password: password });
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
