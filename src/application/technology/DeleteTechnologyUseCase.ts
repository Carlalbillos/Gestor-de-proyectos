import type { TechnologyRepository } from "../../domain/ports/TechnologyRepository";

export class DeleteTechnologyUseCase {
  private technologyRepository: TechnologyRepository;

  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async execute(id: string): Promise<void> {
    await this.technologyRepository.deleteTechnology(id);
  }
}
