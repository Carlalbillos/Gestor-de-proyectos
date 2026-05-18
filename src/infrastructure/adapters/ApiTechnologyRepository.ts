import { api } from "../http/AxiosHttpClient";
import type { TechnologyRepository } from "../../domain/ports/TechnologyRepository";
import type { Technology } from "../../domain/entities/technology.entity";
import { TechnologyMapper } from "../mappers/TechnologyMapper";
import type { CreateTechnologyDTO } from "../../application/dto/technology/CreateTechnology.dto";
import type { UpdateTechnologyDTO } from "../../application/dto/technology/UpdateTechnology.dto";

export class ApiTechnologyRepository implements TechnologyRepository {

  async getTechnologies(): Promise<Technology[]> {
    const response = await api.get<Technology[]>("technologies");
    return (Array.isArray(response.data) ? response.data : []).map(TechnologyMapper.toDomain);
  }

  async createTechnology(dto: CreateTechnologyDTO): Promise<void> {
    await api.post("technologies", {
      id: dto.id,
      name: dto.name,
    });
  }

  async updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<void> {
    await api.patch(`technologies/${id}`, {
      name: dto.name,
    });
  }

  async deleteTechnology(id: string): Promise<void> {
    await api.delete(`technologies/${id}`);
  }
}
