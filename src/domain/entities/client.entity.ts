import { Email } from "../value-objects/Email";

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
    email: Email;
    isActive: boolean;
    isMain: boolean;
    note: string | null;
}