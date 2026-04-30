import type { SectorRepository } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";

export class SectorService {
  private readonly sectorRepository: SectorRepository;

  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async getSectors(): Promise<Sector[]> {
    return await this.sectorRepository.getSectors();
  }
}
