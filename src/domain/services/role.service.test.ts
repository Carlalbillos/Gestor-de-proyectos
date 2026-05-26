import { describe, it, expect } from "vitest";
import { isAdmin, hasRole } from "./role.service";
import { User } from "../entities/user.entity";
import { Email, SystemRole } from "../value-objects";

describe("role.service", () => {
  const createMockUser = (role: unknown): User => new User(
    "user-123",
    "John",
    "Doe",
    new Email("john@example.com"),
    new SystemRole(role),
    true
  );

  describe("isAdmin", () => {
    it("should return false if user is null", () => {
      expect(isAdmin(null)).toBe(false);
    });

    it("should return true if user role is ROLE_ADMIN", () => {
      const user = createMockUser("ROLE_ADMIN");
      expect(isAdmin(user)).toBe(true);
    });

    it("should return true if user role is admin", () => {
      const user = createMockUser("admin");
      expect(isAdmin(user)).toBe(true);
    });

    it("should return true if user role object name is ROLE_ADMIN", () => {
      const user = createMockUser({ name: "ROLE_ADMIN" });
      expect(isAdmin(user)).toBe(true);
    });

    it("should return true if user role object name is admin", () => {
      const user = createMockUser({ name: "admin" });
      expect(isAdmin(user)).toBe(true);
    });

    it("should return false if user has any other role", () => {
      const user = createMockUser("ROLE_USER");
      expect(isAdmin(user)).toBe(false);
    });

    it("should return false if user role object name is ROLE_USER", () => {
      const user = createMockUser({ name: "ROLE_USER" });
      expect(isAdmin(user)).toBe(false);
    });

    it("should return true if user role is a deserialized value object with value admin", () => {
      const user = {
        id: "user-123",
        name: "John",
        surname: "Doe",
        email: { value: "john@example.com" },
        role: { value: "admin" },
        isActive: true
      } as unknown as User;
      expect(isAdmin(user)).toBe(true);
    });
  });

  describe("hasRole", () => {
    it("should return false if user is null", () => {
      expect(hasRole(null, "ROLE_ADMIN")).toBe(false);
    });

    it("should return true if user has the matching string role", () => {
      const user = createMockUser("ROLE_USER");
      expect(hasRole(user, "ROLE_USER")).toBe(true);
    });

    it("should return false if user does not have the matching string role", () => {
      const user = createMockUser("ROLE_USER");
      expect(hasRole(user, "ROLE_ADMIN")).toBe(false);
    });

    it("should return true if user role object has matching name", () => {
      const user = createMockUser({ name: "ROLE_USER" });
      expect(hasRole(user, "ROLE_USER")).toBe(true);
    });

    it("should return false if user role object name does not match", () => {
      const user = createMockUser({ name: "ROLE_USER" });
      expect(hasRole(user, "ROLE_ADMIN")).toBe(false);
    });

    it("should return true if user role is a deserialized value object with matching value", () => {
      const user = {
        id: "user-123",
        name: "John",
        surname: "Doe",
        email: { value: "john@example.com" },
        role: { value: "user" },
        isActive: true
      } as unknown as User;
      expect(hasRole(user, "user")).toBe(true);
    });
  });
});
