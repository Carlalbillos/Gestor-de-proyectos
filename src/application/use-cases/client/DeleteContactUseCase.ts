import type { ClientRepository } from "../../../domain/ports/ClientRepository";

export class DeleteContactUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(clientId: string, contactId: string): Promise<void> {
    return await this.clientRepository.deleteContact(clientId, contactId);
  }
}
