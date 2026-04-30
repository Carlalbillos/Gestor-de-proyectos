import { api } from "./AxiosHttpClient";
import type { SectorRepository } from "../../domain/ports/SectorRepository";
import type { Sector } from "../../domain/entities/sector.entity";

export class ApiSectorRepository implements SectorRepository {
  async getSectors(): Promise<Sector[]> {
    const response = await api.get<Sector[]>("sectors");
    return response.data;
  }
}
