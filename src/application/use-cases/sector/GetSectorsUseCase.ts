import type { SectorRepository } from "../../../domain/ports/SectorRepository";
import type { Sector } from "../../../domain/entities/sector.entity";

export class GetSectorsUseCase {
  private sectorRepository: SectorRepository;
  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async execute(): Promise<Sector[]> {
    return await this.sectorRepository.getSectors();
  }
}
