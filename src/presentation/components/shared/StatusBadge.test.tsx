import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";
import "@testing-library/jest-dom";

describe("StatusBadge", () => {
  it("renders default active text when isActive is true", () => {
    render(<StatusBadge isActive={true} />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("renders default inactive text when isActive is false", () => {
    render(<StatusBadge isActive={false} />);
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });

  it("renders custom active text when provided", () => {
    render(<StatusBadge isActive={true} activeText="En curso" />);
    expect(screen.getByText("En curso")).toBeInTheDocument();
  });

  it("renders custom inactive text when provided", () => {
    render(<StatusBadge isActive={false} inactiveText="Archivado" />);
    expect(screen.getByText("Archivado")).toBeInTheDocument();
  });

  it("renders an icon by default when showIcon is not specified", () => {
    const { container } = render(<StatusBadge isActive={true} />);
    // lucide-react icons render an SVG element
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("does not render an icon when showIcon is false", () => {
    const { container } = render(<StatusBadge isActive={true} showIcon={false} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    render(<StatusBadge isActive={true} className="my-custom-class" />);
    const badge = screen.getByText("Activo").closest("div");
    expect(badge).toHaveClass("my-custom-class");
  });

  it("applies the correct styling for active state", () => {
    render(<StatusBadge isActive={true} />);
    const badge = screen.getByText("Activo").closest("div");
    expect(badge).toHaveClass("bg-emerald-50");
    expect(badge).toHaveClass("text-emerald-700");
  });

  it("applies the correct styling for inactive state", () => {
    render(<StatusBadge isActive={false} />);
    const badge = screen.getByText("Inactivo").closest("div");
    expect(badge).toHaveClass("bg-slate-50");
    expect(badge).toHaveClass("text-slate-600");
  });
});
