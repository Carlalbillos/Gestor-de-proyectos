import type { ProjectTimeEntryRepository, ProjectTimeEntryQueryParams } from "../../domain/ports/ProjectRepository";
import type { ProjectTimeEntry } from "../../domain/entities/project.entity";

export class GetProjectTimeEntriesUseCase {
  private projectRepository: ProjectTimeEntryRepository;
  constructor(projectRepository: ProjectTimeEntryRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]> {
    return await this.projectRepository.getProjectTimeEntries(id, params);
  }
}
