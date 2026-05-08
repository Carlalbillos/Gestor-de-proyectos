import type { TechnologyRepository } from "../../domain/ports/TechnologyRepository";
import type { Technology } from "../../domain/entities/technology.entity";
import type { CreateTechnologyDTO, UpdateTechnologyDTO } from "../dto/technology.dto";

export class TechnologyService {
  private readonly technologyRepository: TechnologyRepository;

  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async getTechnologies(): Promise<Technology[]> {
    return await this.technologyRepository.getTechnologies();
  }

  async createTechnology(dto: CreateTechnologyDTO): Promise<void> {
    return await this.technologyRepository.createTechnology(dto);
  }

  async updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<void> {
    return await this.technologyRepository.updateTechnology(id, dto);
  }

  async deleteTechnology(id: string): Promise<void> {
    return await this.technologyRepository.deleteTechnology(id);
  }
}
