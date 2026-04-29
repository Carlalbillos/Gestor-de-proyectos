export interface ClientSector {
    id: string;
    name: string;
}

export interface Client {
    id: string;
    name: string;
    is_active: boolean;
    sector: ClientSector;
}

export interface CreateClientDTO {
    id: string;
    name: string;
    sector_id: string;
}