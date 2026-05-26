import type { Sector } from "../entities/sector.entity";

// Re-export DTOs for backward compatibility
export type { CreateSectorDTO, UpdateSectorDTO } from "../dtos/sector.dto";

import type { CreateSectorDTO, UpdateSectorDTO } from "../dtos/sector.dto";

export interface SectorRepository {
  getSectors(): Promise<Sector[]>;
  createSector(dto: CreateSectorDTO): Promise<void>;
  updateSector(id: string, dto: UpdateSectorDTO): Promise<void>;
  deleteSector(id: string): Promise<void>;
}
