import type { TechnologyRepository } from "../../../domain/ports/TechnologyRepository";
import type { CreateTechnologyDTO } from "../../dto/technology/CreateTechnology.dto";

export class CreateTechnologyUseCase {
  private technologyRepository: TechnologyRepository;

  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async execute(dto: CreateTechnologyDTO): Promise<void> {
    await this.technologyRepository.createTechnology(dto);
  }
}
