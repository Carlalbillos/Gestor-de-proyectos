import { api } from "./AxiosHttpClient";
import type { TechnologyRepository, CreateTechnologyDTO } from "../../domain/ports/TechnologyRepository";
import type { Technology } from "../../domain/entities/technology.entity";
import { TechnologyMapper } from "../mappers/TechnologyMapper";

export class ApiTechnologyRepository implements TechnologyRepository {
  async getTechnologies(): Promise<Technology[]> {
    const response = await api.get<any[]>("technologies");
    return response.data.map(TechnologyMapper.toDomain);
  }

  async createTechnology(dto: CreateTechnologyDTO): Promise<void> {
    await api.post("technologies", {
      id: dto.id,
      name: dto.name,
    });
  }
}
