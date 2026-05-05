import { api } from "./AxiosHttpClient";
import type { SectorRepository, CreateSectorDTO } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";
import { SectorMapper } from "../mappers/SectorMapper";

export class ApiSectorRepository implements SectorRepository {
  async getSectors(): Promise<Sector[]> {
    const response = await api.get<any[]>("sectors");
    return response.data.map(SectorMapper.toDomain);
  }

  async createSector(dto: CreateSectorDTO): Promise<void> {
    await api.post("sectors", {
      id: dto.id,
      name: dto.name,
    });
  }
}
