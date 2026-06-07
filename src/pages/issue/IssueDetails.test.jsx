import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import IssueDetails from "./IssueDetails";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("./IssueButtons", () => ({
  default: () => <div data-testid="issue-buttons" />,
}));

describe("IssueDetails", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders object metadata without passing a raw object as a React child", () => {
    render(
      <IssueDetails
        isExpanded
        issue={{
          _id: "issue-1",
          internalId: "ISS-1",
          workflow: "Atualizacao de inventario",
          status: "OPEN",
          risk: "WARN",
          sponsor: "Michel",
          details: "Inventory issue",
          metadata: {
            productId: "product-1",
            salesId: "sale-1",
            date: "2026-06-05T12:00:00.000Z",
            quantity: 3,
            name: "Coffee",
            vendor: "Michel",
          },
          createdBy: "system",
          createdAt: "2026-06-05T12:00:00.000Z",
        }}
      />
    );

    expect(screen.getByText(/productId: product-1/)).toBeInTheDocument();
    expect(screen.getByText(/salesId: sale-1/)).toBeInTheDocument();
    expect(screen.getByText(/vendor: Michel/)).toBeInTheDocument();
  });
});
