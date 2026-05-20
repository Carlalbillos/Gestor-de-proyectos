import { Client } from "../../domain/entities/client.entity";
import type { ClientContact } from "../../domain/entities/client.entity";
import { Email } from "../../domain/value-objects/Email";
import { SectorMapper } from "./SectorMapper";
import type { ApiClientResponse, ApiClientContactResponse } from "../http/responses/api-responses";

export class ClientMapper {
  static toDomain(raw: ApiClientResponse): Client {
    return new Client(
      raw.id,
      raw.name,
      Boolean(raw.is_active),
      {
        id: raw.sector?.id ?? "",
        name: SectorMapper.capitalize(raw.sector?.name ?? ""),
      }
    );
  }

  static toContactDomain(raw: ApiClientContactResponse): ClientContact {
    let email: Email | null = null;
    try {
      if (raw.email) {
        email = new Email(raw.email);
      }
    } catch (e) {
      console.error("Invalid email for contact", raw.id, raw.email);
    }

    return {
      id: raw.id,
      fullName: raw.full_name,
      phoneNumber: raw.phone_number ?? null,
      email: email,
      isMain: Boolean(raw.is_main),
      note: raw.note ?? null,
    };
  }
}
