import { DomainException } from "./DomainException";

export class BusinessRuleException extends DomainException {
  readonly code = "BUSINESS_RULE_VIOLATED";

  constructor(message: string) {
    super(message);
  }
}
