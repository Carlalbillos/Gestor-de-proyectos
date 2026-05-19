import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailsHeader } from "./details-header";
import "@testing-library/jest-dom";

describe("DetailsHeader", () => {

  const title = "Test Title";
  const subtitle = "Test Subtitle";

  it("renders the title", () => {
    render(<DetailsHeader title={title} onBack={() => { }} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    render(
      <DetailsHeader
        title={title}
        subTitle={subtitle}
        onBack={() => { }}
      />
    );
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it("renders the back button", () => {
    render(<DetailsHeader title={title} onBack={() => { }} />);
    expect(
      screen.getByRole("button", { name: /volver al listado/i })
    ).toBeInTheDocument();
  });
});