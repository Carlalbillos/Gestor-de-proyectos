import { api } from "./AxiosHttpClient";
import type { SectorRepository, CreateSectorDTO } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";

export class ApiSectorRepository implements SectorRepository {
  async getSectors(): Promise<Sector[]> {
    const response = await api.get<Sector[]>("sectors");
    return response.data;
  }

  async createSector(dto: CreateSectorDTO): Promise<void> {
    await api.post("sectors", {
      id: dto.id,
      name: dto.name,
    });
  }
}
