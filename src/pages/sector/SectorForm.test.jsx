import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SectorForm from "./SectorForm";
import { createSector, updateSector } from "../../shared/hooks/useSectors";

const createMutation = vi.fn();
const updateMutation = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../shared/hooks/useSectors", () => ({
  createSector: vi.fn(),
  updateSector: vi.fn(),
}));

describe("SectorForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders optional sector fields inside the Additional data panel", () => {
    createSector.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateSector.mockReturnValue({ mutateAsync: updateMutation });

    render(<SectorForm sector={{}} />);

    expect(screen.getByText("sector.additionalData")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.cep")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.contact.name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.contact.phone")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sector.contact.email")).toBeInTheDocument();
  });

  it("submits additional sector fields with a nested contact object", async () => {
    createMutation.mockResolvedValue({});
    createSector.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateSector.mockReturnValue({ mutateAsync: updateMutation });

    render(<SectorForm sector={{}} />);

    fireEvent.change(screen.getByPlaceholderText("sector.name"), { target: { value: "Storage" } });
    fireEvent.change(screen.getByPlaceholderText("sector.type"), { target: { value: "Warehouse" } });
    fireEvent.change(screen.getByPlaceholderText("sector.address"), { target: { value: "Rua Central, 10" } });
    fireEvent.change(screen.getByPlaceholderText("sector.cep"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByPlaceholderText("sector.contact.name"), { target: { value: "Maria" } });
    fireEvent.change(screen.getByPlaceholderText("sector.contact.phone"), { target: { value: "11888888888" } });
    fireEvent.change(screen.getByPlaceholderText("sector.contact.email"), { target: { value: "maria@example.com" } });

    expect(screen.getByPlaceholderText("sector.cep")).toHaveValue("12345-678");

    fireEvent.click(screen.getByRole("button", { name: /button.save/i }));

    await waitFor(() => expect(createMutation).toHaveBeenCalledWith(expect.objectContaining({
      name: "Storage",
      type: "Warehouse",
      address: "Rua Central, 10",
      cep: "12345678",
      contact: {
        name: "Maria",
        phone: "11888888888",
        email: "maria@example.com",
      },
    })));
  });

  it("keeps empty additional fields out of create payloads", async () => {
    createMutation.mockResolvedValue({});
    createSector.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateSector.mockReturnValue({ mutateAsync: updateMutation });

    render(<SectorForm sector={{}} />);

    fireEvent.change(screen.getByPlaceholderText("sector.name"), { target: { value: "Storage" } });
    fireEvent.click(screen.getByRole("button", { name: /button.save/i }));

    await waitFor(() => expect(createMutation).toHaveBeenCalledWith(expect.objectContaining({
      name: "Storage",
    })));
    expect(createMutation.mock.calls[0][0].type).toBeUndefined();
    expect(createMutation.mock.calls[0][0].address).toBeUndefined();
    expect(createMutation.mock.calls[0][0].cep).toBeUndefined();
    expect(createMutation.mock.calls[0][0].contact).toBeUndefined();
  });
});
