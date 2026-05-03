import { api } from "./AxiosHttpClient";
import type { TechnologyRepository, CreateTechnologyDTO } from "../../domain/ports/TechnologyRepository";
import type { Technology } from "../../domain/entities/technology.entity";

export class ApiTechnologyRepository implements TechnologyRepository {
  async getTechnologies(): Promise<Technology[]> {
    const response = await api.get<Technology[]>("technologies");
    return response.data;
  }

  async createTechnology(dto: CreateTechnologyDTO): Promise<void> {
    await api.post("technologies", {
      id: dto.id,
      name: dto.name,
    });
  }
}
