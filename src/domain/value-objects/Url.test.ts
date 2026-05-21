import { describe, it, expect } from "vitest";
import { Url } from "./Url";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

describe("Url Value Object", () => {
  it("should create valid Url instances", () => {
    const u1 = new Url("https://example.com");
    const u2 = new Url("http://localhost:3000/api/v1");

    expect(u1.getValue()).toBe("https://example.com");
    expect(u2.getValue()).toBe("http://localhost:3000/api/v1");
  });

  it("should throw BusinessRuleException for invalid URLs", () => {
    const invalidUrls = ["not-a-url", "www.google.com", "http://", ""];

    invalidUrls.forEach((val) => {
      expect(() => new Url(val)).toThrow(BusinessRuleException);
    });
  });

  it("should check for equality with equals()", () => {
    const u1 = new Url("https://google.com/ ");
    const u2 = new Url("https://google.com/");
    const u3 = new Url("https://google.com");

    expect(u1.equals(u2)).toBe(true);
    expect(u1.equals(u3)).toBe(false);
  });
});
