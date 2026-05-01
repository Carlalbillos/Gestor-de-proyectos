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

  // Override base methods to reset pagination
  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchProjects();
  },

  setFilterStatus: (filterStatus) => {
    set({ filterStatus, page: 1 });
    get().fetchProjects();
  },

  fetchProjects: async () => {
    // We pass requireAdmin: false because employees can see their assigned projects
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
            params.is_active = true;
          } else if (state.filterStatus === "inactive") {
            params.is_active = false;
          }

          if (state.search.trim()) {
            params.search = state.search.trim();
          }

          const result = await service.getProjectsList(params);
          return result.data;
        }

        // Non-admin flow: fetch only assigned projects
        return await userService.getUserProjects(user.id);
      },
      (projects, state) => {
        let filteredProjects = projects;

        // Apply client-side search only (admin already filtered in backend, but we need this for employee flow)
        if (state.search.trim()) {
          const term = state.search.trim().toLowerCase();
          filteredProjects = filteredProjects.filter((project) =>
            project.name.toLowerCase().includes(term)
          );
        }

        // Apply client-side status filter (admin already filtered in backend, but we need this for employee flow)
        if (state.filterStatus !== "all") {
          filteredProjects = filteredProjects.filter((project) => {
            const projectIsActive = Boolean(project.is_active);
            return projectIsActive === (state.filterStatus === "active");
          });
        }

        return filteredProjects;
      },
      false // requireAdmin
    );
  },
}));
