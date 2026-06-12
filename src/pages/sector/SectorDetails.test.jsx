import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SectorDetails from "./SectorDetails";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("./SectorButtons", () => ({
  default: () => <div data-testid="sector-buttons" />,
}));

describe("SectorDetails", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders additional sector fields only when values are present", () => {
    render(
      <SectorDetails
        isExpanded
        sector={{
          _id: "sector-1",
          name: "Storage",
          type: "Warehouse",
          address: "Rua Central, 10",
          cep: "",
          contact: {
            name: "Maria",
            phone: null,
            email: "maria@example.com",
          },
        }}
      />
    );

    expect(screen.getByText("Warehouse")).toBeInTheDocument();
    expect(screen.getByText("Rua Central, 10")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("maria@example.com")).toBeInTheDocument();
    expect(screen.queryByText(/sector.cep:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/sector.contact.phone:/)).not.toBeInTheDocument();
  });
});
