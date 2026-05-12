import { create } from "zustand";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry, Technology } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import type { ClientContact } from "@/domain/entities/client.entity";
import type { CreateDevelopmentDTO, UpdateDevelopmentDTO, UpdateProjectDTO } from "@/application/dto/project.dto";
import type { UpdateTimeEntryDTO } from "@/application/dto/user.dto";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ProjectService } from "@/application/services/ProjectService";
import { ApiUserRepository } from "@/infrastructure/adapters/ApiUserRepository";
import { UserService } from "@/application/services/UserService";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ClientService } from "@/application/services/ClientService";
import { ApiTechnologyRepository } from "@/infrastructure/adapters/ApiTechnologyRepository";
import { TechnologyService } from "@/application/services/TechnologyService";

const projectService = new ProjectService(new ApiProjectRepository());
const userService = new UserService(new ApiUserRepository());
const clientService = new ClientService(new ApiClientRepository());
const technologyService = new TechnologyService(new ApiTechnologyRepository());

interface ProjectDetailsState {
  project: Project | null;
  users: ProjectUser[];
  roles: ProjectRole[];
  allUsers: User[];
  developments: ProjectDevelopment[];
  clientContacts: ClientContact[];
  timeEntries: ProjectTimeEntry[];
  technologies: Technology[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchProjectDetails: (id: string) => Promise<void>;
  fetchProjectTimeEntries: (id: string) => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  fetchTechnologies: () => Promise<void>;
  assignUser: (projectId: string, userId: string, roleId: string) => Promise<void>;
  updateUserRole: (projectId: string, userId: string, roleId: string) => Promise<void>;
  removeUser: (projectId: string, userId: string) => Promise<void>;
  updateTimeEntry: (projectId: string, entryId: string, data: UpdateTimeEntryDTO) => Promise<void>;
  deleteTimeEntry: (projectId: string, entryId: string) => Promise<void>;
  changeStatus: (id: string) => Promise<void>;
  updateProject: (id: string, project: UpdateProjectDTO) => Promise<void>;
  addDevelopment: (projectId: string, development: CreateDevelopmentDTO) => Promise<void>;
  updateDevelopment: (projectId: string, development: UpdateDevelopmentDTO) => Promise<void>;
  deleteDevelopment: (projectId: string, developmentId: string) => Promise<void>;
  clearDetails: () => void;
}

export const useProjectDetailsStore = create<ProjectDetailsState>((set, get) => ({
  project: null,
  users: [],
  roles: [],
  allUsers: [],
  developments: [],
  clientContacts: [],
  timeEntries: [],
  technologies: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProjectDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [project, users, developments, timeEntries] = await Promise.all([
        projectService.getProjectById(id),
        projectService.getProjectUsers(id),
        projectService.getProjectDevelopments(id),
        projectService.getProjectTimeEntries(id)
      ]);

      let clientContacts: ClientContact[] = [];
      if (project?.client?.id) {
        clientContacts = await clientService.getClientContacts(project.client.id);
      }

      set({ project, users, developments, clientContacts, timeEntries, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Error al cargar los detalles del proyecto",
        isLoading: false
      });
    }
  },

  fetchProjectTimeEntries: async (id: string) => {
    try {
      const timeEntries = await projectService.getProjectTimeEntries(id);
      set({ timeEntries });
    } catch (error: any) {
    }
  },

  fetchRoles: async () => {
    if (get().roles.length > 0) return;
    try {
      const roles = await projectService.getProjectRoles();
      set({ roles });
    } catch (error: any) {
      console.error("Error fetching roles", error);
    }
  },

  fetchAllUsers: async () => {
    if (get().allUsers.length > 0) return;
    try {
      const response = await userService.getUsers({ limit: 9999 });
      set({ allUsers: response.data });
    } catch (error: any) {
      console.error("Error fetching all users", error);
    }
  },

  fetchTechnologies: async () => {
    if (get().technologies.length > 0) return;
    try {
      const technologies = await technologyService.getTechnologies();
      set({ technologies });
    } catch (error: any) {
      console.error("Error fetching technologies", error);
    }
  },

  assignUser: async (projectId: string, userId: string, roleId: string) => {
    set({ isSaving: true });
    try {
      await projectService.assignUser(projectId, userId, roleId);
      const users = await projectService.getProjectUsers(projectId);
      set({ users, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateUserRole: async (projectId: string, userId: string, roleId: string) => {
    set({ isSaving: true });
    const { users } = get();
    const updatedUsers = users.map(u => ({
      appUserId: u.appUserId,
      roleId: u.appUserId === userId ? roleId : (u.role?.id || "")
    }));

    try {
      await projectService.updateProjectUsers(projectId, updatedUsers);
      const usersResponse = await projectService.getProjectUsers(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  removeUser: async (projectId: string, userId: string) => {
    set({ isSaving: true });
    try {
      await projectService.removeUser(projectId, userId);
      const usersResponse = await projectService.getProjectUsers(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateTimeEntry: async (projectId: string, entryId: string, data: UpdateTimeEntryDTO) => {
    set({ isSaving: true });
    try {
      await projectService.updateProjectTimeEntry(projectId, entryId, data);
      await get().fetchProjectTimeEntries(projectId);
    } catch (error: any) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteTimeEntry: async (projectId: string, entryId: string) => {
    set({ isSaving: true });

    try {
      await projectService.deleteProjectTimeEntry(projectId, entryId);
      await get().fetchProjectTimeEntries(projectId);
    } catch (error) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  changeStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.changeStatus(id);
      const project = await projectService.getProjectById(id);
      set({ project, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Error al cambiar el estado del proyecto",
        isLoading: false
      });
      throw error;
    }
  },

  updateProject: async (id: string, project: UpdateProjectDTO) => {
    set({ isSaving: true });
    try {
      await projectService.updateProject(id, project);
      await get().fetchProjectDetails(id);
    } catch (error: any) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  addDevelopment: async (projectId: string, development: CreateDevelopmentDTO) => {
    set({ isSaving: true });
    try {
      await projectService.createDevelopment(projectId, development);
      const developments = await projectService.getProjectDevelopments(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateDevelopment: async (projectId: string, development: UpdateDevelopmentDTO) => {
    set({ isSaving: true });
    try {
      await projectService.updateDevelopment(projectId, development);
      const developments = await projectService.getProjectDevelopments(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  deleteDevelopment: async (projectId: string, developmentId: string) => {
    set({ isSaving: true });
    try {
      await projectService.deleteDevelopment(projectId, developmentId);
      const developments = await projectService.getProjectDevelopments(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({
      project: null,
      users: [],
      roles: [],
      allUsers: [],
      developments: [],
      clientContacts: [],
      timeEntries: [],
      technologies: [],
      error: null,
      isLoading: false,
      isSaving: false
    });
  },
}));
