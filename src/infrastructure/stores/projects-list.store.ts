import { create } from "zustand";
import { ProjectService } from "../../application/services/project.service";
import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { useAuthStore } from "./auth.store";
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
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "admin";
        
    set({ isLoading: true, error: null });
    try {
      const params = { 
        page, 
        search: search || undefined,
        allProjects: isAdmin
      };
      
      const result = await service.getProjectsList(params);
      
      set({ projects: result.data, total: result.total, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de proyectos" });
    }
  }
}));
