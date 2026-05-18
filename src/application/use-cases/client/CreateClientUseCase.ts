import type { ClientRepository, CreateClientDTO } from "../../../domain/ports/ClientRepository";

export class CreateClientUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(dto: CreateClientDTO): Promise<void> {
    return await this.clientRepository.createClient(dto);
  }
}
