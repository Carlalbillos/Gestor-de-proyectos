import type { SectorRepository, CreateSectorDTO } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";

export class SectorService {
  private readonly sectorRepository: SectorRepository;

  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async getSectors(): Promise<Sector[]> {
    return await this.sectorRepository.getSectors();
  }

  async createSector(dto: CreateSectorDTO): Promise<void> {
    return await this.sectorRepository.createSector(dto);
  }
}
