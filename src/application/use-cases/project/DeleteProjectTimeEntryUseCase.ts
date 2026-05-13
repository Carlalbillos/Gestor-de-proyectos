import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class DeleteProjectTimeEntryUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, entryId: string): Promise<void> {
    return await this.projectRepository.deleteProjectTimeEntry(projectId, entryId);
  }
}
