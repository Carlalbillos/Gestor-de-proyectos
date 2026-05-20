import type { ClientRepository } from "../../domain/ports/ClientRepository";

export class ChangeClientStatusUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.clientRepository.changeStatus(id);
  }
}
