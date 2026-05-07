import { create } from "zustand";
import { UserService } from "../../application/services/UserService";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import type { User } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";

const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

interface DashboardState {
  profile: User | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  projects: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [profile, projects] = await Promise.all([
        userService.getUserProfile(userId),
        userService.getUserProjects(userId),
      ]);
      set({ profile, projects, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar el dashboard" });
    }
  },
}));
