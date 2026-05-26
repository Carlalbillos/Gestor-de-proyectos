import { describe, it, expect } from "vitest";
import { Email } from "./Email";

describe("Email Value Object", () => {
  it("should create a valid Email instance", () => {
    const emailStr = "Test@example.com";
    const email = new Email(emailStr);

    expect(email.getValue()).toBe("test@example.com");
  });

  it("should throw an error for invalid email formats", () => {
    const invalidEmails = [
      "plainaddress",
      "@example.com",
      "Joe Smith <email@example.com>",
      "email.example.com",
      "email@example",
      "  test@example.com",
      "test@example.com  ",
    ];

    invalidEmails.forEach((emailStr) => {
      expect(() => new Email(emailStr)).toThrowError(
        `El formato del email "${emailStr}" no es válido.`
      );
    });
  });

  it("should check for equality with another Email instance using equals()", () => {
    const email1 = new Email("user@example.com");
    const email2 = new Email("USER@EXAMPLE.COM");
    const email3 = new Email("other@example.com");

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });

  it("should return the formatted email when toString() is called", () => {
    const email = new Email("Hello@World.com");
    expect(email.toString()).toBe("hello@world.com");
  });
});
