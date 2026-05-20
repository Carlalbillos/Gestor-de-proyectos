import type { TechnologyRepository } from "../../domain/ports/TechnologyRepository";
import type { UpdateTechnologyDTO } from "../../domain/ports/TechnologyRepository";

export class UpdateTechnologyUseCase {
  private technologyRepository: TechnologyRepository;

  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async execute(id: string, dto: UpdateTechnologyDTO): Promise<void> {
    await this.technologyRepository.updateTechnology(id, dto);
  }
}
