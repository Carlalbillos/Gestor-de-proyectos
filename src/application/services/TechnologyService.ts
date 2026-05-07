import type { TechnologyRepository, CreateTechnologyDTO } from "../../domain/ports/TechnologyRepository";
import type { Technology } from "../../domain/entities/technology.entity";

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
}
