import type { Sector } from "../entities/sector.entity";

export interface CreateSectorDTO {
  id: string;
  name: string;
}

export interface SectorRepository {
  getSectors(): Promise<Sector[]>;
  createSector(dto: CreateSectorDTO): Promise<void>;
}
