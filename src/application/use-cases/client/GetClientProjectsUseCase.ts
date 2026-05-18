import type { ClientRepository, Project } from "../../../domain/ports/ClientRepository";

export class GetClientProjectsUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(clientId: string): Promise<Project[]> {
    return await this.clientRepository.getClientProjects(clientId);
  }
}
