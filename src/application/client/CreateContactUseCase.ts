import type { ClientRepository, CreateContactDTO } from "../../domain/ports/ClientRepository";

export class CreateContactUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(clientId: string, contactId: string, contact: CreateContactDTO): Promise<void> {

    return await this.clientRepository.createContact(clientId, contactId, contact);
  }
}
