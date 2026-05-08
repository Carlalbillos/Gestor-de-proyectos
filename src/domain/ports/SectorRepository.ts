import type { Sector } from "../entities/sector.entity";
import type { CreateSectorDTO, UpdateSectorDTO } from "@/application/dto/sector.dto";


export interface SectorRepository {
  getSectors(): Promise<Sector[]>;
  createSector(dto: CreateSectorDTO): Promise<void>;
  updateSector(id: string, dto: UpdateSectorDTO): Promise<void>;
  deleteSector(id: string): Promise<void>;
}
