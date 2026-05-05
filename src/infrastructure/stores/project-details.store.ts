import { create } from "zustand";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ProjectService } from "@/application/services/project.service";
import { ApiUserRepository } from "@/infrastructure/adapters/ApiUserRepository";
import { UserService } from "@/application/services/user.service";

interface ProjectDetailsState {
  project: Project | null;
  users: ProjectUser[];
  roles: ProjectRole[];
  allUsers: User[];
  developments: ProjectDevelopment[];
  isLoading: boolean;
  error: string | null;
  fetchProjectDetails: (id: string) => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  assignUser: (projectId: string, userId: string, roleId: string) => Promise<void>;
  updateUserRole: (projectId: string, userId: string, roleId: string) => Promise<void>;
  removeUser: (projectId: string, userId: string) => Promise<void>;
  clearDetails: () => void;
}

const projectRepository = new ApiProjectRepository();
const projectService = new ProjectService(projectRepository);
const userRepository = new ApiUserRepository();
const userService = new UserService(userRepository);

export const useProjectDetailsStore = create<ProjectDetailsState>((set) => ({
  project: null,
  users: [],
  roles: [],
  allUsers: [],
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

  fetchRoles: async () => {
    try {
      const roles = await projectService.getProjectRoles();
      set({ roles });
    } catch (error: any) {
      console.error("Error fetching roles", error);
    }
  },

  fetchAllUsers: async () => {
    try {
      const allUsers = await userService.getUsers();
      set({ allUsers });
    } catch (error: any) {
      console.error("Error fetching all users", error);
    }
  },

  assignUser: async (projectId: string, userId: string, roleId: string) => {
    try {
      await projectService.assignUser(projectId, userId, roleId);
      const users = await projectService.getProjectUsers(projectId);
      set({ users });
    } catch (error: any) {
      throw new Error(error.message || "Error al asignar usuario");
    }
  },

  updateUserRole: async (projectId: string, userId: string, roleId: string) => {
    const { users } = useProjectDetailsStore.getState();
    const updatedUsers = users.map(u => ({
      appUserId: u.appUserId,
      roleId: u.appUserId === userId ? roleId : (u.role?.id || "")
    }));

    try {
      await projectService.updateProjectUsers(projectId, updatedUsers);
      const usersResponse = await projectService.getProjectUsers(projectId);
      set({ users: usersResponse });
    } catch (error: any) {
      throw new Error(error.message || "Error al actualizar rol");
    }
  },

  removeUser: async (projectId: string, userId: string) => {
    try {
      await projectService.removeUser(projectId, userId);
      const users = await projectService.getProjectUsers(projectId);
      set({ users });
    } catch (error: any) {
      throw new Error(error.message || "Error al eliminar usuario");
    }
  },

  clearDetails: () => {
    set({ project: null, users: [], roles: [], allUsers: [], developments: [], error: null, isLoading: false });
  },
}));
