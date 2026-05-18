import type { ClientRepository, ClientQueryParams, PaginatedResult, Client } from "../../../domain/ports/ClientRepository";

export class GetClientsUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(params?: ClientQueryParams): Promise<PaginatedResult<Client>> {
    return await this.clientRepository.getClients(params);
  }
}
