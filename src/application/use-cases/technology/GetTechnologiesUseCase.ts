import type { TechnologyRepository } from "../../../domain/ports/TechnologyRepository";
import type { Technology } from "../../../domain/entities/project.entity";

export class GetTechnologiesUseCase {
  private technologyRepository: TechnologyRepository;
  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async execute(): Promise<Technology[]> {
    return await this.technologyRepository.getTechnologies();
  }
}
