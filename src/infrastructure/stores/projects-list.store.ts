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
  filterStatus: "all" | "active" | "inactive";

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectsListStore = create<ProjectsListState>((set, get) => ({
  projects: [],
  total: 0,
  isLoading: false,
  error: null,
  page: 1,
  filterStatus: "all",
  search: "",

  setPage: (page: number) => {
    set({ page });
    get().fetchProjects();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchProjects();
  },

  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
    set({ filterStatus, page: 1 });
    get().fetchProjects();
  },

  fetchProjects: async () => {
    const { page, filterStatus } = get();
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

        if (filterStatus === "active") {
          params.is_active = true;
        } else if (filterStatus === "inactive") {
          params.is_active = false;
        }

        const result = await service.getProjectsList(params);
        const filteredProjects =
          filterStatus === "all"
            ? result.data
            : result.data.filter((project) => {
                const projectIsActive = Boolean(project.is_active);
                return projectIsActive === (filterStatus === "active");
              });

        set({ projects: filteredProjects, total: filteredProjects.length, isLoading: false });
        return;
      }

      const userProjects = await userService.getUserProjects(user.id);
      const filteredProjects =
        filterStatus === "all"
          ? userProjects
          : userProjects.filter((project) => {
              const projectIsActive = Boolean(project.is_active);
              return projectIsActive === (filterStatus === "active");
            });

      set({ projects: filteredProjects, total: filteredProjects.length, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar la lista de proyectos" });
    }
  }
}));
