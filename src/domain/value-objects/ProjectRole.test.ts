import { describe, it, expect } from "vitest";
import { ProjectRole } from "./ProjectRole";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

describe("ProjectRole Value Object", () => {
  it("should create a valid ProjectRole instance and normalize input", () => {
    const pm = new ProjectRole("r-1", "PROJECT_MANAGER");
    const kam = new ProjectRole("r-2", "KEY_ACCOUNT_MANAGER");
    const dev = new ProjectRole("r-3", "developer ");

    expect(pm.getName()).toBe("PROJECT_MANAGER");
    expect(pm.getLabel()).toBe("Project Manager");

    expect(kam.getName()).toBe("KAM");
    expect(kam.getLabel()).toBe("KAM");

    expect(dev.getName()).toBe("DEVELOPER");
    expect(dev.getLabel()).toBe("Developer");
  });

  it("should throw BusinessRuleException for invalid project roles", () => {
    expect(() => new ProjectRole("r-4", "CTO")).toThrow(BusinessRuleException);
    expect(() => new ProjectRole("r-4", "CTO")).toThrow("Rol de proyecto no válido: CTO");
  });

  it("should check for equality with equals()", () => {
    const role1 = new ProjectRole("r-1", "DEVELOPER");
    const role2 = new ProjectRole("r-1", "DEVELOPER");
    const role3 = new ProjectRole("r-2", "DEVELOPER");
    const role4 = new ProjectRole("r-1", "TECH_LEADER");

    expect(role1.equals(role2)).toBe(true);
    expect(role1.equals(role3)).toBe(false);
    expect(role1.equals(role4)).toBe(false);
  });
});
