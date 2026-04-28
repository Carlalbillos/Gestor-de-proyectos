import { create } from "zustand";
import { ProjectService } from "../../application/services/project.service";
import { UserService } from "../../application/services/user.service";
import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { ApiUserRepository } from "../adapters/ApiUserRepository";
import { useAuthStore } from "./auth.store";
import { isAdmin } from "../ui/lib/roleChecker";
import type { Project } from "../../domain/entities/project.entity";

const repository = new ApiProjectRepository();
const service = new ProjectService(repository);
const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

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
    const { page } = get();
    const user = useAuthStore.getState().user;
    const isAdminUser = isAdmin(user);
        
    set({ isLoading: true, error: null });
    try {
      if (!user) {
        set({ projects: [], total: 0, isLoading: false });
        return;
      }

      if (isAdminUser) {
        const params: any = {
          page,
          limit: 20,
        };

        const result = await service.getProjectsList(params);
        set({ projects: result.data, total: result.total, isLoading: false });
        return;
      }

      const userProjects = await userService.getUserProjects(user.id);
      set({ projects: userProjects, total: userProjects.length, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de proyectos" });
    }
  }
}));
