export interface Client {
  id: string;
  name: string;
  is_active: boolean;
}

export interface ClientRepository {
  getClients(): Promise<Client[]>;
}
