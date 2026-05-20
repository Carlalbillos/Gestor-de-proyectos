import { DomainException } from "./DomainException";

export class EntityNotFoundException extends DomainException {
  readonly code = "ENTITY_NOT_FOUND";

  constructor(entity: string, id: string) {
    super(`La entidad '${entity}' con ID [${id}] no fue encontrada.`);
  }
}
