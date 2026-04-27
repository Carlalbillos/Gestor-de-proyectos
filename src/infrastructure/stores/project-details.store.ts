import { create } from "zustand";
import type { Project, ProjectUser, ProjectDevelopment } from "@/domain/entities/project.entity";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ProjectService } from "@/application/services/project.service";

interface ProjectDetailsState {
  project: Project | null;
  users: ProjectUser[];
  developments: ProjectDevelopment[];
  isLoading: boolean;
  error: string | null;
  fetchProjectDetails: (id: string) => Promise<void>;
  clearDetails: () => void;
}

const projectRepository = new ApiProjectRepository();
const projectService = new ProjectService(projectRepository);

export const useProjectDetailsStore = create<ProjectDetailsState>((set) => ({
  project: null,
  users: [],
  developments: [],
  isLoading: false,
  error: null,

  fetchProjectDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [project, users, developments] = await Promise.all([
        projectService.getProjectById(id),
        projectService.getProjectUsers(id),
        projectService.getProjectDevelopments(id),
      ]);
      set({ project, users, developments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del proyecto", isLoading: false });
    }
  },

  clearDetails: () => {
    set({ project: null, users: [], developments: [], error: null, isLoading: false });
  },
}));
