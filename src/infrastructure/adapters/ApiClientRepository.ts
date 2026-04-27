import { api } from "./AxiosHttpClient";
import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

export class ApiClientRepository implements ClientRepository {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>("clients");
    return response.data;
  }
}
