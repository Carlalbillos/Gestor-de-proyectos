import type { TechnologyRepository } from "../../../domain/ports/TechnologyRepository";
import type { UpdateTechnologyDTO } from "../../dto/technology/UpdateTechnology.dto";

export class UpdateTechnologyUseCase {
  private technologyRepository: TechnologyRepository;

  constructor(technologyRepository: TechnologyRepository) {
    this.technologyRepository = technologyRepository;
  }

  async execute(id: string, dto: UpdateTechnologyDTO): Promise<void> {
    await this.technologyRepository.updateTechnology(id, dto);
  }
}
