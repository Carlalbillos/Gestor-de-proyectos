import type { ProjectRepository, ProjectTimeEntryQueryParams } from "../../../domain/ports/ProjectRepository";
import type { ProjectTimeEntry } from "../../../domain/entities/project.entity";

export class GetProjectTimeEntriesUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]> {
    return await this.projectRepository.getProjectTimeEntries(id, params);
  }
}
