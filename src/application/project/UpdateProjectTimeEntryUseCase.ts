import type { ProjectTimeEntryRepository } from "../../domain/ports/ProjectRepository";
import type { UpdateTimeEntryDTO } from "../../domain/ports/ProjectRepository";

export class UpdateProjectTimeEntryUseCase {
  private projectRepository: ProjectTimeEntryRepository;
  constructor(projectRepository: ProjectTimeEntryRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void> {
    return await this.projectRepository.updateProjectTimeEntry(projectId, entryId, data);
  }
}
