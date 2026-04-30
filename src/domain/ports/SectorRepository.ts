import type { Sector } from "../entities/sector.entity";

export interface SectorRepository {
  getSectors(): Promise<Sector[]>;
}
