import { describe, it, expect } from "vitest";
import { LoggedHours } from "./LoggedHours";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

describe("LoggedHours Value Object", () => {
  it("should create valid LoggedHours instances", () => {
    const hours1 = new LoggedHours(8);
    const hours2 = new LoggedHours(0.5);
    const hours3 = new LoggedHours(24);

    expect(hours1.getValue()).toBe(8);
    expect(hours2.getValue()).toBe(0.5);
    expect(hours3.getValue()).toBe(24);
  });

  it("should throw BusinessRuleException for invalid hours", () => {
    const invalidHours = [0, 0.4, 25, -5, NaN];

    invalidHours.forEach((val) => {
      expect(() => new LoggedHours(val)).toThrow(BusinessRuleException);
    });
  });

  it("should check for equality with equals()", () => {
    const h1 = new LoggedHours(4);
    const h2 = new LoggedHours(4);
    const h3 = new LoggedHours(4.5);

    expect(h1.equals(h2)).toBe(true);
    expect(h1.equals(h3)).toBe(false);
  });

  it("should return string representation using toString()", () => {
    const h = new LoggedHours(7.5);
    expect(h.toString()).toBe("7.5");
  });
});
