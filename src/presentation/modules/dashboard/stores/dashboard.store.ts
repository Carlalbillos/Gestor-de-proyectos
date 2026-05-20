import { create } from "zustand";
import { container } from "@/infrastructure/di/container";
import type { User, TimeEntry } from "@/domain/entities/user.entity";
import type { Project } from "@/domain/entities/project.entity";
import type { UpdateTimeEntryDTO } from "@/domain/ports/ProjectRepository";

const {
  getUserByIdUseCase,
  getUserProjectsUseCase,
  getUserTimeEntriesUseCase,
  updateProjectTimeEntryUseCase,
  deleteProjectTimeEntryUseCase,
} = container;

interface DashboardState {
  profile: User | null;
  projects: Project[];
  timeEntries: TimeEntry[];
  totalHours: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
  updateTimeEntry: (userId: string, projectId: string, entryId: string, data: UpdateTimeEntryDTO) => Promise<void>;
  deleteTimeEntry: (userId: string, projectId: string, entryId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  projects: [],
  timeEntries: [],
  totalHours: 0,
  isLoading: false,
  isSaving: false,
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

  updateTimeEntry: async (userId: string, projectId: string, entryId: string, data: UpdateTimeEntryDTO) => {
    set({ isSaving: true });
    try {
      await updateProjectTimeEntryUseCase.execute(projectId, entryId, data);
      const timeEntriesResponse = await getUserTimeEntriesUseCase.execute(userId);
      set({ 
        timeEntries: timeEntriesResponse.data, 
        totalHours: timeEntriesResponse.totalHours 
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteTimeEntry: async (userId: string, projectId: string, entryId: string) => {
    set({ isSaving: true });
    try {
      await deleteProjectTimeEntryUseCase.execute(projectId, entryId);
      const timeEntriesResponse = await getUserTimeEntriesUseCase.execute(userId);
      set({ 
        timeEntries: timeEntriesResponse.data, 
        totalHours: timeEntriesResponse.totalHours 
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
}));
