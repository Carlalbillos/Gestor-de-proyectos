import { create } from "zustand";
import { GetSectorsUseCase } from "../../application/use-cases/sector/GetSectorsUseCase";
import { CreateSectorUseCase } from "../../application/use-cases/sector/CreateSectorUseCase";
import { UpdateSectorUseCase } from "../../application/use-cases/sector/UpdateSectorUseCase";
import { DeleteSectorUseCase } from "../../application/use-cases/sector/DeleteSectorUseCase";
import { ApiSectorRepository } from "../adapters/ApiSectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";
import type { CreateSectorDTO } from "@/application/dto/sector/CreateSector.dto";
import type { UpdateSectorDTO } from "@/application/dto/sector/UpdateSector.dto";

const repository = new ApiSectorRepository();
const getSectorsUseCase = new GetSectorsUseCase(repository);
const createSectorUseCase = new CreateSectorUseCase(repository);
const updateSectorUseCase = new UpdateSectorUseCase(repository);
const deleteSectorUseCase = new DeleteSectorUseCase(repository);

interface SectorsState {
  sectors: Sector[];
  isLoading: boolean;
  error: string | null;
  
  fetchSectors: (force?: boolean) => Promise<void>;
  createSector: (dto: CreateSectorDTO) => Promise<void>;
  updateSector: (id: string, dto: UpdateSectorDTO) => Promise<void>;
  deleteSector: (id: string) => Promise<void>;
}

export const useSectorsStore = create<SectorsState>((set, get) => ({
  sectors: [],
  isLoading: false,
  error: null,

  fetchSectors: async (force = false) => {
    // Si ya tenemos sectores y no estamos forzando la carga, no hacemos nada
    if (get().sectors.length > 0 && !force) return;

    set({ isLoading: true, error: null });
    try {
      const data = await getSectorsUseCase.execute();
      set({ sectors: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar sectores" });
    }
  },

  createSector: async (dto: CreateSectorDTO) => {
    set({ isLoading: true });
    try {
      await createSectorUseCase.execute(dto);
      // Recargamos la lista después de crear
      await get().fetchSectors(true);
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateSector: async (id: string, dto: UpdateSectorDTO) => {
    set({ isLoading: true });
    try {
      await updateSectorUseCase.execute(id, dto);
      // Actualizamos localmente para evitar parpadeos
      set((state) => ({
        sectors: state.sectors.map((s) => 
          s.id === id ? { ...s, name: dto.name } : s
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteSector: async (id: string) => {
    set({ isLoading: true });
    try {
      await deleteSectorUseCase.execute(id);
      // Actualizamos localmente
      set((state) => ({
        sectors: state.sectors.filter((s) => s.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
