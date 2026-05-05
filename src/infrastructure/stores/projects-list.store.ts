import { create } from "zustand";

import { ProjectService } from "../../application/services/project.service";
import { UserService } from "../../application/services/user.service";

import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { ApiUserRepository } from "../adapters/ApiUserRepository";

import { useAuthStore } from "./auth.store";
import { isAdmin } from "../ui/lib/roleChecker";

import type { Project } from "../../domain/entities/project.entity";
import { createBaseListSlice, handleListFetch } from "./factories/list-factory";
import type { BaseListState } from "./factories/list-factory";

const repository = new ApiProjectRepository();
const service = new ProjectService(repository);

const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

interface ProjectsListState extends BaseListState<Project> {
  page: number;
  setPage: (page: number) => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectsListStore = create<ProjectsListState>((set, get) => ({
  ...createBaseListSlice<Project, ProjectsListState>(set, get, "fetchProjects"),
  page: 1,

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
            limit: 20,
          };

          if (state.filterStatus === "active") {
            params.isActive = true;
          } else if (state.filterStatus === "inactive") {
            params.isActive = false;
          }

          if (state.search.trim()) {
            params.search = state.search.trim();
          }

          const result = await service.getProjectsList(params);
          return result.data;
        }

        return await userService.getUserProjects(user.id);
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
}));
