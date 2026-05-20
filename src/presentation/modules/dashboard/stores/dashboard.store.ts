import { create } from "zustand";
import { GetUserByIdUseCase } from "@/application/use-cases/user/GetUserByIdUseCase";
import { GetUserProjectsUseCase } from "@/application/use-cases/user/GetUserProjectsUseCase";
import { GetUserTimeEntriesUseCase } from "@/application/use-cases/user/GetUserTimeEntriesUseCase";
import { ApiUserRepository } from "@/infrastructure/adapters/ApiUserRepository";
import type { User, TimeEntry } from "@/domain/entities/user.entity";
import type { Project } from "@/domain/entities/project.entity";

const userRepository = new ApiUserRepository();
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getUserProjectsUseCase = new GetUserProjectsUseCase(userRepository);
const getUserTimeEntriesUseCase = new GetUserTimeEntriesUseCase(userRepository);

interface DashboardState {
  profile: User | null;
  projects: Project[];
  timeEntries: TimeEntry[];
  totalHours: number;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  projects: [],
  timeEntries: [],
  totalHours: 0,
  isLoading: false,
  error: null,

  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [profile, projects, timeEntriesResponse] = await Promise.all([
        getUserByIdUseCase.execute(userId),
        getUserProjectsUseCase.execute(userId),
        getUserTimeEntriesUseCase.execute(userId),
      ]);
      set({ 
        profile, 
        projects, 
        timeEntries: timeEntriesResponse.data, 
        totalHours: timeEntriesResponse.totalHours,
        isLoading: false 
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar el dashboard" });
    }
  },
}));
