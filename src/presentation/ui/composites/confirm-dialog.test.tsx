import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./confirm-dialog";
import "@testing-library/jest-dom";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    title: "¿Eliminar elemento?",
    description: "Esta acción no se puede deshacer.",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
  };

  it("renders the dialog title and description when open", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onClose={onCloseMock}
      />
    );

    const confirmButton = screen.getByRole("button", { name: "Eliminar" });
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("calls onClose when the cancel button is clicked", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onClose={onCloseMock}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("disables buttons when isLoading is true", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onClose={onCloseMock}
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /procesando/i });
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    fireEvent.click(confirmButton);
    fireEvent.click(cancelButton);

    expect(onConfirmMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("renders the error message when provided", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();
    const errorMessage = "Ocurrió un error al procesar la solicitud.";

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onClose={onCloseMock}
        errorMessage={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
