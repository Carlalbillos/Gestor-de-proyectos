import type { SectorRepository } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";

import type { CreateSectorDTO, UpdateSectorDTO } from "@/application/dto/sector.dto";

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

  async updateSector(id: string, dto: UpdateSectorDTO): Promise<void> {
    return await this.sectorRepository.updateSector(id, dto);
  }

  async deleteSector(id: string): Promise<void> {
    return await this.sectorRepository.deleteSector(id);
  }
}
