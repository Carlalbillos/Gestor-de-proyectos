import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

export class GetClientByIdUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<Client | null> {
    return await this.clientRepository.getClientById(id);
  }
}
