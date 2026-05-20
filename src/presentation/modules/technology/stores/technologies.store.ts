import { create } from "zustand";
import { container } from "@/infrastructure/di/container";
import type { Technology } from "@/domain/entities/technology.entity";
import type { CreateTechnologyDTO } from "@/domain/ports/TechnologyRepository";
import type { UpdateTechnologyDTO } from "@/domain/ports/TechnologyRepository";

const {
  getTechnologiesUseCase,
  createTechnologyUseCase,
  updateTechnologyUseCase,
  deleteTechnologyUseCase,
} = container;

interface TechnologiesState {
  technologies: Technology[];
  isLoading: boolean;
  error: string | null;
  
  fetchTechnologies: (force?: boolean) => Promise<void>;
  createTechnology: (dto: CreateTechnologyDTO) => Promise<void>;
  updateTechnology: (id: string, dto: UpdateTechnologyDTO) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;
}

export const useTechnologiesStore = create<TechnologiesState>((set, get) => ({
  technologies: [],
  isLoading: false,
  error: null,

  fetchTechnologies: async (force = false) => {
    if (get().technologies.length > 0 && !force) return;

    set({ isLoading: true, error: null });
    try {
      const data = await getTechnologiesUseCase.execute();
      set({ technologies: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar tecnologías" });
    }
  },

  createTechnology: async (dto: CreateTechnologyDTO) => {
    set({ isLoading: true });
    try {
      await createTechnologyUseCase.execute(dto);
      await get().fetchTechnologies(true);
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTechnology: async (id: string, dto: UpdateTechnologyDTO) => {
    set({ isLoading: true });
    try {
      await updateTechnologyUseCase.execute(id, dto);
      set((state) => ({
        technologies: state.technologies.map((t) => 
          t.id === id ? { ...t, name: dto.name } : t
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTechnology: async (id: string) => {
    set({ isLoading: true });
    try {
      await deleteTechnologyUseCase.execute(id);
      set((state) => ({
        technologies: state.technologies.filter((t) => t.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
