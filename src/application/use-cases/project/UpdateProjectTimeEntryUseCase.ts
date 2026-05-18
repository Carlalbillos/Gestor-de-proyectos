import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { UpdateTimeEntryDTO } from "../../dto/user/UpdateTimeEntry.dto";

export class UpdateProjectTimeEntryUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void> {
    return await this.projectRepository.updateProjectTimeEntry(projectId, entryId, data);
  }
}
