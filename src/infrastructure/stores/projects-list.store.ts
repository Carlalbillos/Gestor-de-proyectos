import { create } from "zustand";

import { GetProjectsUseCase } from "../../application/use-cases/project/GetProjectsUseCase";
import { CreateProjectUseCase } from "../../application/use-cases/project/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/project/UpdateProjectUseCase";
import { GetUserProjectsUseCase } from "../../application/use-cases/user/GetUserProjectsUseCase";

import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { ApiUserRepository } from "../adapters/ApiUserRepository";

import { useAuthStore } from "./auth.store";
import { isAdmin } from "@/domain/services/role.service";

import type { Project } from "../../domain/entities/project.entity";
import type { CreateProjectDTO } from "../../application/dto/project/CreateProject.dto";
import type { UpdateProjectDTO } from "../../application/dto/project/UpdateProject.dto";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const projectRepository = new ApiProjectRepository();
const userRepository = new ApiUserRepository();

const getProjectsUseCase = new GetProjectsUseCase(projectRepository);
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const getUserProjectsUseCase = new GetUserProjectsUseCase(userRepository);

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
          const params: any = {
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
      },
      false
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
