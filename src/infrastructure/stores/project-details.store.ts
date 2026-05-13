import { create } from "zustand";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry, Technology } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import type { ClientContact } from "@/domain/entities/client.entity";
import type { CreateDevelopmentDTO } from "@/application/dto/project/CreateDevelopment.dto";
import type { UpdateDevelopmentDTO } from "@/application/dto/project/UpdateDevelopment.dto";
import type { UpdateProjectDTO } from "@/application/dto/project/UpdateProject.dto";
import type { UpdateTimeEntryDTO } from "@/application/dto/user/UpdateTimeEntry.dto";
import { ApiProjectRepository } from "@/infrastructure/adapters/ApiProjectRepository";
import { ApiUserRepository } from "@/infrastructure/adapters/ApiUserRepository";
import { ApiClientRepository } from "@/infrastructure/adapters/ApiClientRepository";
import { ApiTechnologyRepository } from "@/infrastructure/adapters/ApiTechnologyRepository";

import { GetProjectByIdUseCase } from "@/application/use-cases/project/GetProjectByIdUseCase";
import { GetProjectUsersUseCase } from "@/application/use-cases/project/GetProjectUsersUseCase";
import { GetProjectDevelopmentsUseCase } from "@/application/use-cases/project/GetProjectDevelopmentsUseCase";
import { GetProjectTimeEntriesUseCase } from "@/application/use-cases/project/GetProjectTimeEntriesUseCase";
import { GetProjectRolesUseCase } from "@/application/use-cases/project/GetProjectRolesUseCase";
import { AssignUserUseCase } from "@/application/use-cases/project/AssignUserUseCase";
import { UpdateProjectUsersUseCase } from "@/application/use-cases/project/UpdateProjectUsersUseCase";
import { RemoveUserUseCase } from "@/application/use-cases/project/RemoveUserUseCase";
import { UpdateProjectTimeEntryUseCase } from "@/application/use-cases/project/UpdateProjectTimeEntryUseCase";
import { DeleteProjectTimeEntryUseCase } from "@/application/use-cases/project/DeleteProjectTimeEntryUseCase";
import { ChangeProjectStatusUseCase } from "@/application/use-cases/project/ChangeProjectStatusUseCase";
import { UpdateProjectUseCase } from "@/application/use-cases/project/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "@/application/use-cases/project/DeleteProjectUseCase";
import { CreateDevelopmentUseCase } from "@/application/use-cases/project/CreateDevelopmentUseCase";
import { UpdateDevelopmentUseCase } from "@/application/use-cases/project/UpdateDevelopmentUseCase";
import { DeleteDevelopmentUseCase } from "@/application/use-cases/project/DeleteDevelopmentUseCase";

import { GetUsersUseCase } from "@/application/use-cases/user/GetUsersUseCase";
import { GetClientContactsUseCase } from "@/application/use-cases/client/GetClientContactsUseCase";
import { SetMainContactUseCase } from "@/application/use-cases/client/SetMainContactUseCase";
import { GetTechnologiesUseCase } from "@/application/use-cases/technology/GetTechnologiesUseCase";

const projectRepository = new ApiProjectRepository();
const userRepository = new ApiUserRepository();
const clientRepository = new ApiClientRepository();
const technologyRepository = new ApiTechnologyRepository();

const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);
const getProjectUsersUseCase = new GetProjectUsersUseCase(projectRepository);
const getProjectDevelopmentsUseCase = new GetProjectDevelopmentsUseCase(projectRepository);
const getProjectTimeEntriesUseCase = new GetProjectTimeEntriesUseCase(projectRepository);
const getProjectRolesUseCase = new GetProjectRolesUseCase(projectRepository);
const assignUserUseCase = new AssignUserUseCase(projectRepository);
const updateProjectUsersUseCase = new UpdateProjectUsersUseCase(projectRepository);
const removeUserUseCase = new RemoveUserUseCase(projectRepository);
const updateProjectTimeEntryUseCase = new UpdateProjectTimeEntryUseCase(projectRepository);
const deleteProjectTimeEntryUseCase = new DeleteProjectTimeEntryUseCase(projectRepository);
const changeProjectStatusUseCase = new ChangeProjectStatusUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
const createDevelopmentUseCase = new CreateDevelopmentUseCase(projectRepository);
const updateDevelopmentUseCase = new UpdateDevelopmentUseCase(projectRepository);
const deleteDevelopmentUseCase = new DeleteDevelopmentUseCase(projectRepository);

const getUsersUseCase = new GetUsersUseCase(userRepository);
const getClientContactsUseCase = new GetClientContactsUseCase(clientRepository);
const setMainContactUseCase = new SetMainContactUseCase(clientRepository);
const getTechnologiesUseCase = new GetTechnologiesUseCase(technologyRepository);

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
  deleteProject: (id: string) => Promise<void>;
  addDevelopment: (projectId: string, development: CreateDevelopmentDTO) => Promise<void>;
  updateDevelopment: (projectId: string, development: UpdateDevelopmentDTO) => Promise<void>;
  deleteDevelopment: (projectId: string, developmentId: string) => Promise<void>;
  setMainContact: (clientId: string, contactId: string) => Promise<void>;
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
        getProjectByIdUseCase.execute(id),
        getProjectUsersUseCase.execute(id),
        getProjectDevelopmentsUseCase.execute(id),
        getProjectTimeEntriesUseCase.execute(id)
      ]);

      let clientContacts: ClientContact[] = [];
      if (project?.client?.id) {
        clientContacts = await getClientContactsUseCase.execute(project.client.id);
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
      const timeEntries = await getProjectTimeEntriesUseCase.execute(id);
      set({ timeEntries });
    } catch (error: any) {
    }
  },

  fetchRoles: async () => {
    if (get().roles.length > 0) return;
    try {
      const roles = await getProjectRolesUseCase.execute();
      set({ roles });
    } catch (error: any) {
      console.error("Error fetching roles", error);
    }
  },

  fetchAllUsers: async () => {
    if (get().allUsers.length > 0) return;
    try {
      const response = await getUsersUseCase.execute({ limit: 9999 });
      set({ allUsers: response.data });
    } catch (error: any) {
      console.error("Error fetching all users", error);
    }
  },

  fetchTechnologies: async () => {
    if (get().technologies.length > 0) return;
    try {
      const technologies = await getTechnologiesUseCase.execute();
      set({ technologies });
    } catch (error: any) {
      console.error("Error fetching technologies", error);
    }
  },

  assignUser: async (projectId: string, userId: string, roleId: string) => {
    set({ isSaving: true });
    try {
      await assignUserUseCase.execute(projectId, userId, roleId);
      const users = await getProjectUsersUseCase.execute(projectId);
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
      await updateProjectUsersUseCase.execute(projectId, updatedUsers);
      const usersResponse = await getProjectUsersUseCase.execute(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  removeUser: async (projectId: string, userId: string) => {
    set({ isSaving: true });
    try {
      await removeUserUseCase.execute(projectId, userId);
      const usersResponse = await getProjectUsersUseCase.execute(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateTimeEntry: async (projectId: string, entryId: string, data: UpdateTimeEntryDTO) => {
    set({ isSaving: true });
    try {
      await updateProjectTimeEntryUseCase.execute(projectId, entryId, data);
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
      await deleteProjectTimeEntryUseCase.execute(projectId, entryId);
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
      await changeProjectStatusUseCase.execute(id);
      const project = await getProjectByIdUseCase.execute(id);
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
      await updateProjectUseCase.execute(id, project);
      await get().fetchProjectDetails(id);
    } catch (error: any) {
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteProject: async (id: string) => {
    set({ isSaving: true, error: null });
    try {
      await deleteProjectUseCase.execute(id);
      set({ project: null, isSaving: false });
    } catch (error: any) {
      set({
        error: error.message || "Error al eliminar el proyecto",
        isSaving: false
      });
      throw error;
    }
  },

  addDevelopment: async (projectId: string, development: CreateDevelopmentDTO) => {
    set({ isSaving: true });
    try {
      await createDevelopmentUseCase.execute(projectId, development);
      const developments = await getProjectDevelopmentsUseCase.execute(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateDevelopment: async (projectId: string, development: UpdateDevelopmentDTO) => {
    set({ isSaving: true });
    try {
      await updateDevelopmentUseCase.execute(projectId, development);
      const developments = await getProjectDevelopmentsUseCase.execute(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  deleteDevelopment: async (projectId: string, developmentId: string) => {
    set({ isSaving: true });
    try {
      await deleteDevelopmentUseCase.execute(projectId, developmentId);
      const developments = await getProjectDevelopmentsUseCase.execute(projectId);
      set({ developments, isSaving: false });
    } catch (error: any) {
      set({ isSaving: false });
      throw error;
    }
  },

  setMainContact: async (clientId: string, contactId: string) => {
    set({ isSaving: true, error: null });
    try {
      await setMainContactUseCase.execute(clientId, contactId);
      const clientContacts = await getClientContactsUseCase.execute(clientId);
      set({ clientContacts, isSaving: false });
    } catch (error: any) {
      set({
        error: error.message || "Error al marcar el contacto como principal",
        isSaving: false
      });
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
