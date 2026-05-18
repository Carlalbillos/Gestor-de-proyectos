import type { SectorRepository } from "../../../domain/ports/SectorRepository";

export class DeleteSectorUseCase {
  private sectorRepository: SectorRepository;
  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.sectorRepository.deleteSector(id);
  }
}
