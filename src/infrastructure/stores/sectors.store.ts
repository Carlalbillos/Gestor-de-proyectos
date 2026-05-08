import { create } from "zustand";
import { SectorService } from "../../application/services/SectorService";
import { ApiSectorRepository } from "../adapters/ApiSectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";
import type { CreateSectorDTO, UpdateSectorDTO } from "@/application/dto/sector.dto";

const repository = new ApiSectorRepository();
const service = new SectorService(repository);

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
      const data = await service.getSectors();
      set({ sectors: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Error al cargar sectores" });
    }
  },

  createSector: async (dto: CreateSectorDTO) => {
    set({ isLoading: true });
    try {
      await service.createSector(dto);
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
      await service.updateSector(id, dto);
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
      await service.deleteSector(id);
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
