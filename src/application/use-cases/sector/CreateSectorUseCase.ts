import type { SectorRepository } from "../../../domain/ports/SectorRepository";
import type { CreateSectorDTO } from "../../dto/sector/CreateSector.dto";

export class CreateSectorUseCase {
  private sectorRepository: SectorRepository;
  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async execute(dto: CreateSectorDTO): Promise<void> {
    return await this.sectorRepository.createSector(dto);
  }
}
