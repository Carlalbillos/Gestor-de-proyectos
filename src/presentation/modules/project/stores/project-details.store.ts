import { create } from "zustand";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry, Technology } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";
import type { ClientContact } from "@/domain/entities/client.entity";
import type { CreateDevelopmentDTO } from "@/domain/ports/ProjectRepository";
import type { UpdateDevelopmentDTO } from "@/domain/ports/ProjectRepository";
import type { UpdateProjectDTO } from "@/domain/ports/ProjectRepository";
import type { UpdateTimeEntryDTO } from "@/domain/ports/ProjectRepository";
import { container } from "@/infrastructure/di/container";

const {
  getProjectByIdUseCase,
  getProjectUsersUseCase,
  getProjectDevelopmentsUseCase,
  getProjectTimeEntriesUseCase,
  getProjectRolesUseCase,
  assignUserUseCase,
  updateProjectUsersUseCase,
  changeUserStatusUseCase,
  updateProjectTimeEntryUseCase,
  deleteProjectTimeEntryUseCase,
  changeProjectStatusUseCase,
  updateProjectUseCase,
  deleteProjectUseCase,
  createDevelopmentUseCase,
  updateDevelopmentUseCase,
  deleteDevelopmentUseCase,
  getUsersUseCase,
  getClientContactsUseCase,
  setMainContactUseCase,
  getTechnologiesUseCase,
} = container;


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
  changeUserStatus: (projectId: string, userId: string, isActive: boolean) => Promise<void>;
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
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Error al cargar los detalles del proyecto",
        isLoading: false
      });
    }
  },

  fetchProjectTimeEntries: async (id: string) => {
    try {
      const timeEntries = await getProjectTimeEntriesUseCase.execute(id);
      set({ timeEntries });
    } catch (error: unknown) {
      console.error("Error fetching project time entries", error);
    }
  },

  fetchRoles: async () => {
    if (get().roles.length > 0) return;
    try {
      const roles = await getProjectRolesUseCase.execute();
      set({ roles });
    } catch (error: unknown) {
      console.error("Error fetching roles", error);
    }
  },

  fetchAllUsers: async () => {
    if (get().allUsers.length > 0) return;
    try {
      const response = await getUsersUseCase.execute({ limit: 9999 });
      set({ allUsers: response.data });
    } catch (error: unknown) {
      console.error("Error fetching all users", error);
    }
  },

  fetchTechnologies: async () => {
    if (get().technologies.length > 0) return;
    try {
      const technologies = await getTechnologiesUseCase.execute();
      set({ technologies });
    } catch (error: unknown) {
      console.error("Error fetching technologies", error);
    }
  },

  assignUser: async (projectId: string, userId: string, roleId: string) => {
    set({ isSaving: true });
    try {
      await assignUserUseCase.execute(projectId, userId, roleId);
      const users = await getProjectUsersUseCase.execute(projectId);
      set({ users, isSaving: false });
    } catch (error: unknown) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateUserRole: async (projectId: string, userId: string, roleId: string) => {
    set({ isSaving: true });
    const { users } = get();
    const updatedUsers = users.map(u => ({
      appUserId: u.appUserId,
      roleId: u.appUserId === userId ? roleId : (u.role ? u.role.getId() : "")
    }));

    try {
      await updateProjectUsersUseCase.execute(projectId, updatedUsers);
      const usersResponse = await getProjectUsersUseCase.execute(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: unknown) {
      set({ isSaving: false });
      throw error;
    }
  },

  changeUserStatus: async (projectId: string, userId: string, isActive: boolean) => {
    set({ isSaving: true });
    try {
      await changeUserStatusUseCase.execute(projectId, userId, isActive);
      const usersResponse = await getProjectUsersUseCase.execute(projectId);
      set({ users: usersResponse, isSaving: false });
    } catch (error: unknown) {
      set({ isSaving: false });
      throw error;
    }
  },

  updateTimeEntry: async (projectId: string, entryId: string, data: UpdateTimeEntryDTO) => {
    set({ isSaving: true });
    try {
      await updateProjectTimeEntryUseCase.execute(projectId, entryId, data);
      await get().fetchProjectTimeEntries(projectId);
    } finally {
      set({ isSaving: false });
    }
  },

  deleteTimeEntry: async (projectId: string, entryId: string) => {
    set({ isSaving: true });

    try {
      await deleteProjectTimeEntryUseCase.execute(projectId, entryId);
      await get().fetchProjectTimeEntries(projectId);
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
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Error al cambiar el estado del proyecto",
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
    } finally {
      set({ isSaving: false });
    }
  },

  deleteProject: async (id: string) => {
    set({ isSaving: true, error: null });
    try {
      await deleteProjectUseCase.execute(id);
      set({ project: null, isSaving: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Error al eliminar el proyecto",
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Error al marcar el contacto como principal",
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
