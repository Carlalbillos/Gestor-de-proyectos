import type { Client, ClientContact } from "../../domain/entities/client.entity";
import { Email } from "../../domain/value-objects/Email";

export class ClientMapper {
  static toDomain(raw: any): Client {
    return {
      id: raw.id,
      name: raw.name,
      isActive: Boolean(raw.is_active),
      sector: {
        id: raw.sector?.id ?? "",
        name: raw.sector?.name ?? "",
      },
    };
  }

  static toContactDomain(raw: any): ClientContact {
    return {
      id: raw.id,
      fullName: raw.full_name,
      phoneNumber: raw.phone_number ?? null,
      email: new Email(raw.email),
      isActive: Boolean(raw.is_active),
      isMain: Boolean(raw.is_main),
      note: raw.note ?? null,
    };
  }
}
