import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomerCreate from "./CustomerCreate";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("./CustomerForm", () => ({
  default: ({ customer }) => <div data-testid="customer-form">{customer.customerType}</div>,
}));

describe("CustomerCreate", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("asks for customer type before rendering the creation form", () => {
    render(<CustomerCreate />);

    fireEvent.click(screen.getByTitle("button.tooltip.form"));

    expect(screen.getByText("customer.type.select")).toBeInTheDocument();
    expect(screen.queryByTestId("customer-form")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /customer.type.pj/i }));

    expect(screen.getByTestId("customer-form")).toHaveTextContent("PJ");
  });
});
