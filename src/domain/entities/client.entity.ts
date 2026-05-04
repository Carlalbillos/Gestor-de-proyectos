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

export interface ClientContact {
    id: string;
    full_name: string;
    phone_number: string | null;
    email: string;
    is_active: boolean;
    is_main: boolean;
    note: string | null;
}

export interface CreateClientDTO {
    id: string;
    name: string;
    sector_id: string;
}

export interface UpdateClientDTO {
    name?: string;
    sector_id?: string;
    is_active?: boolean;
}