import { create } from "zustand";
import { container } from "@/infrastructure/di/container";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";
import type { Project } from "@/domain/entities/project.entity";
import type { CreateProjectDTO, UpdateProjectDTO, ProjectQueryParams } from "@/domain/ports/ProjectRepository";
import { createBaseListSlice, handleListFetch } from "@/presentation/stores/factories/list-factory";
import type { BaseListState } from "@/presentation/stores/factories/list-factory";

const { getProjectsUseCase, createProjectUseCase, updateProjectUseCase, getUserProjectsUseCase } = container;

interface ProjectsListState extends BaseListState<Project> {
  page: number;
  isSaving: boolean;
  setPage: (page: number) => void;
  fetchProjects: () => Promise<void>;
  addProject: (project: CreateProjectDTO) => Promise<void>;
  updateProject: (id: string, project: UpdateProjectDTO) => Promise<void>;
}

export const useProjectsListStore = create<ProjectsListState>((set, get) => ({
  ...createBaseListSlice<Project, ProjectsListState>(set, get, "fetchProjects"),
  page: 1,
  isSaving: false,

  setPage: (page: number) => {
    set({ page });
    get().fetchProjects();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchProjects();
  },

  setFilterStatus: (filterStatus) => {
    set({ filterStatus, page: 1 });
    get().fetchProjects();
  },

  fetchProjects: async () => {
    await handleListFetch<Project, ProjectsListState>(
      set,
      get,
      async () => {
        const state = get();
        const user = useAuthStore.getState().user;
        const isAdminUser = isAdmin(user);

        if (!user) return [];

        if (isAdminUser) {
          const params: ProjectQueryParams = {
            page: state.page,
          };

          if (state.filterStatus === "active") {
            params.isActive = true;
          } else if (state.filterStatus === "inactive") {
            params.isActive = false;
          }

          if (state.search.trim()) {
            params.search = state.search.trim();
          }

          const result = await getProjectsUseCase.execute(params);
          return result;
        }

        return await getUserProjectsUseCase.execute(user.id);
      },
      (projects, state) => {
        let filteredProjects = projects;

        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filteredProjects = filteredProjects.filter((project) =>
            project.name.toLowerCase().includes(term)
          );
        }

        if (state.filterStatus !== "all") {
          filteredProjects = filteredProjects.filter((project) => {
            const projectIsActive = Boolean(project.isActive);
            return projectIsActive === (state.filterStatus === "active");
          });
        }

        return filteredProjects;
      }
      // No authorize option — projects are viewable by all authenticated users
    );
  },

  addProject: async (project: CreateProjectDTO) => {
    set({ isSaving: true });
    try {
      await createProjectUseCase.execute(project);
      await get().fetchProjects();
    } finally {
      set({ isSaving: false });
    }
  },

  updateProject: async (id: string, project: UpdateProjectDTO) => {
    set({ isSaving: true });
    try {
      await updateProjectUseCase.execute(id, project);
      await get().fetchProjects();
    } finally {
      set({ isSaving: false });
    }
  },
}));
