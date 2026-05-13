import type { ClientRepository, ClientContact } from "../../../domain/ports/ClientRepository";

export class GetClientContactsUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(clientId: string): Promise<ClientContact[]> {
    return await this.clientRepository.getClientContacts(clientId);
  }
}
