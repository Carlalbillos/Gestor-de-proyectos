import type { ProjectTimeEntryRepository } from "../../domain/ports/ProjectRepository";

export class DeleteProjectTimeEntryUseCase {
  private projectRepository: ProjectTimeEntryRepository;
  constructor(projectRepository: ProjectTimeEntryRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, entryId: string): Promise<void> {
    return await this.projectRepository.deleteProjectTimeEntry(projectId, entryId);
  }
}
