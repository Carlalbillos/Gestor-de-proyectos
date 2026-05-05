export interface ClientSector {
    id: string;
    name: string;
}

export interface Client {
    id: string;
    name: string;
    isActive: boolean;
    sector: ClientSector;
}

export interface ClientContact {
    id: string;
    fullName: string;
    phoneNumber: string | null;
    email: string;
    isActive: boolean;
    isMain: boolean;
    note: string | null;
}

export interface CreateClientDTO {
    id: string;
    name: string;
    sectorId: string;
}

export interface UpdateClientDTO {
    name?: string;
    sectorId?: string;
    isActive?: boolean;
}