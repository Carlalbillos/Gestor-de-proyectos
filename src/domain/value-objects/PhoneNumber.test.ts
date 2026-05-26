import { describe, it, expect } from "vitest";
import { PhoneNumber } from "./PhoneNumber";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

describe("PhoneNumber Value Object", () => {
  it("should create valid PhoneNumber instances and sanitize spaces/dashes/parentheses", () => {
    const p1 = new PhoneNumber("666 555 444");
    const p2 = new PhoneNumber("+34 (91) 444-55-66");

    expect(p1.getValue()).toBe("666555444");
    expect(p2.getValue()).toBe("+34914445566");
  });

  it("should throw BusinessRuleException for invalid phone formats", () => {
    const invalidPhones = ["123", "abc123456", "12345678901234567", "", "  "];

    invalidPhones.forEach((val) => {
      expect(() => new PhoneNumber(val)).toThrow(BusinessRuleException);
    });
  });

  it("should check for equality with equals()", () => {
    const p1 = new PhoneNumber("666 555 444");
    const p2 = new PhoneNumber("666555444");
    const p3 = new PhoneNumber("666555445");

    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
  });
});
