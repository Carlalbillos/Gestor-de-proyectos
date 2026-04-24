import { create } from "zustand";
import { ProjectService } from "../../application/services/project.service";
import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import type { Project } from "../../domain/entities/project.entity";

const repository = new ApiProjectRepository();
const service = new ProjectService(repository);

interface ProjectsListState {
  projects: Project[];
  total: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  search: string;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectsListStore = create<ProjectsListState>((set, get) => ({
  projects: [],
  total: 0,
  isLoading: false,
  error: null,
  page: 1,
  search: "",

  setPage: (page: number) => {
    set({ page });
    get().fetchProjects();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchProjects();
  },

  fetchProjects: async () => {
    const { page, search } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await service.getProjectsList({ page, search: search || undefined });
      set({ projects: result.data, total: result.total, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de proyectos" });
    }
  }
}));
