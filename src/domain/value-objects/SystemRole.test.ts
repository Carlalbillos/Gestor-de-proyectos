import { describe, it, expect } from "vitest";
import { SystemRole } from "./SystemRole";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

describe("SystemRole Value Object", () => {
  it("should create a valid SystemRole instance", () => {
    const adminRole = new SystemRole("admin");
    const userRole = new SystemRole("user");

    expect(adminRole.getValue()).toBe("admin");
    expect(adminRole.isAdmin()).toBe(true);
    expect(adminRole.isUser()).toBe(false);

    expect(userRole.getValue()).toBe("user");
    expect(userRole.isAdmin()).toBe(false);
    expect(userRole.isUser()).toBe(true);
  });

  it("should normalize API roles", () => {
    const role1 = new SystemRole("ROLE_ADMIN");
    const role2 = new SystemRole("ROLE_EMPLOYEE");
    const role3 = new SystemRole({ name: "ROLE_ADMIN" });
    const role4 = new SystemRole({ name: "ROLE_EMPLOYEE" });
    const role5 = new SystemRole("ADMIN");

    expect(role1.getValue()).toBe("admin");
    expect(role2.getValue()).toBe("user");
    expect(role3.getValue()).toBe("admin");
    expect(role4.getValue()).toBe("user");
    expect(role5.getValue()).toBe("admin");
  });

  it("should throw BusinessRuleException for invalid roles", () => {
    const invalidRoles = ["superadmin", "guest", "", null, undefined];

    invalidRoles.forEach((role) => {
      expect(() => new SystemRole(role)).toThrow(BusinessRuleException);
      expect(() => new SystemRole(role)).toThrow("Rol de usuario inválido");
    });
  });

  it("should check for equality with another SystemRole instance using equals()", () => {
    const role1 = new SystemRole("admin");
    const role2 = new SystemRole("ROLE_ADMIN");
    const role3 = new SystemRole("user");

    expect(role1.equals(role2)).toBe(true);
    expect(role1.equals(role3)).toBe(false);
  });
});
