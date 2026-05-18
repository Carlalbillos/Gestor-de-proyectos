import type { SectorRepository } from "../../../domain/ports/SectorRepository";
import type { UpdateSectorDTO } from "../../dto/sector/UpdateSector.dto";

export class UpdateSectorUseCase {
  private sectorRepository: SectorRepository;
  constructor(sectorRepository: SectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  async execute(id: string, dto: UpdateSectorDTO): Promise<void> {
    return await this.sectorRepository.updateSector(id, dto);
  }
}
