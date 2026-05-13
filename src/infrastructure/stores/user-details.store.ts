import { create } from "zustand";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { GetUserProjectsUseCase } from "../../application/use-cases/user/GetUserProjectsUseCase";
import { GetUserTimeEntriesUseCase } from "../../application/use-cases/user/GetUserTimeEntriesUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { ChangeActivityUserUseCase } from "../../application/use-cases/user/ChangeActivityUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { AdminChangePasswordUseCase } from "../../application/use-cases/user/AdminChangePasswordUseCase";
import { CreateTimeEntryUseCase } from "../../application/use-cases/user/CreateTimeEntryUseCase";

import { ApiUserRepository } from "../adapters/ApiUserRepository";
import type { User, TimeEntry } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";
import type { CreateTimeEntryDTO } from "../../application/dto/user/CreateTimeEntry.dto";

const userRepository = new ApiUserRepository();
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getUserProjectsUseCase = new GetUserProjectsUseCase(userRepository);
const getUserTimeEntriesUseCase = new GetUserTimeEntriesUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const changeActivityUserUseCase = new ChangeActivityUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const adminChangePasswordUseCase = new AdminChangePasswordUseCase(userRepository);
const createTimeEntryUseCase = new CreateTimeEntryUseCase(userRepository);

interface UserDetailsState {
  user: User | null;
  projects: Project[];
  timeEntries: TimeEntry[];
  totalHours: number;
  isLoading: boolean;
  error: string | null;
  fetchUserDetails: (id: string) => Promise<void>;
  updateUser: (id: string, data: any) => Promise<void>;
  changeActivityUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  adminChangePassword: (id: string, password: string) => Promise<void>;
  addTimeEntry: (id: string, data: CreateTimeEntryDTO) => Promise<void>;
  clearDetails: () => void;
}

export const useUserDetailsStore = create<UserDetailsState>((set) => ({
  user: null,
  projects: [],
  timeEntries: [],
  totalHours: 0,
  isLoading: false,
  error: null,

  fetchUserDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [user, projects, timeEntriesResponse] = await Promise.all([
        getUserByIdUseCase.execute(id),
        getUserProjectsUseCase.execute(id),
        getUserTimeEntriesUseCase.execute(id),
      ]);
      set({
        user,
        projects,
        timeEntries: timeEntriesResponse.data,
        totalHours: timeEntriesResponse.totalHours,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Error al cargar los detalles del usuario", isLoading: false });
    }
  },

  updateUser: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await updateUserUseCase.execute(id, data);
      const updatedUser = await getUserByIdUseCase.execute(id);
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al actualizar el usuario", isLoading: false });
      throw error;
    }
  },

  changeActivityUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await changeActivityUserUseCase.execute(id);
      const updatedUser = await getUserByIdUseCase.execute(id);
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar el estado del usuario", isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUserUseCase.execute(id);
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al borrar el usuario", isLoading: false });
      throw error;
    }
  },

  adminChangePassword: async (id: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminChangePasswordUseCase.execute(id, { newPassword: password });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Error al cambiar la contraseña", isLoading: false });
      throw error;
    }
  },

  addTimeEntry: async (id: string, data: CreateTimeEntryDTO) => {
    set({ isLoading: true, error: null });
    try {
      await createTimeEntryUseCase.execute(id, data);
      const timeEntriesResponse = await getUserTimeEntriesUseCase.execute(id);
      set({ 
        timeEntries: timeEntriesResponse.data,
        totalHours: timeEntriesResponse.totalHours,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Error al registrar la imputación de horas", isLoading: false });
      throw error;
    }
  },

  clearDetails: () => {
    set({ user: null, projects: [], timeEntries: [], totalHours: 0, error: null, isLoading: false });
  },
}));
