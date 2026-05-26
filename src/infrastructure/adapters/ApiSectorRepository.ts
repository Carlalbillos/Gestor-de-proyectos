import { api } from "../http/AxiosHttpClient";
import type { SectorRepository } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";
import { SectorMapper } from "../mappers/SectorMapper";

import type { CreateSectorDTO } from "@/domain/ports/SectorRepository";
import type { UpdateSectorDTO } from "@/domain/ports/SectorRepository";


export class ApiSectorRepository implements SectorRepository {
  async getSectors(): Promise<Sector[]> {
    const response = await api.get<any[]>("sectors");
    return (Array.isArray(response.data) ? response.data : []).map(SectorMapper.toDomain);
  }

  async createSector(dto: CreateSectorDTO): Promise<void> {
    await api.post("sectors", {
      id: dto.id,
      name: dto.name,
    });
  }

  async updateSector(id: string, dto: UpdateSectorDTO): Promise<void> {
    await api.patch(`sectors/${id}`, {
      name: dto.name,
    });
  }

  async deleteSector(id: string): Promise<void> {
    await api.delete(`sectors/${id}`);
  }
}
