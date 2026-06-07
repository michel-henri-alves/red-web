import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import AddDiscount, { calculatePercentageDiscount, isWholePercentageValue } from "./AddDiscount";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

function AddDiscountHarness() {
  const [discountType, setDiscountType] = useState("amount");
  const [discount, setDiscount] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const handleDiscountTypeChange = (nextType) => {
    setDiscountType(nextType);

    if (nextType === "amount") {
      setDiscountPercentage("");
    } else {
      setDiscount("");
    }
  };

  return (
    <AddDiscount
      updateBill={vi.fn()}
      handleDiscount={(event) => setDiscount(event.target.value)}
      handlePercentageDiscount={(event) => {
        if (isWholePercentageValue(event.target.value)) {
          setDiscountPercentage(event.target.value);
        }
      }}
      discount={discount}
      discountPercentage={discountPercentage}
      discountType={discountType}
      onDiscountTypeChange={handleDiscountTypeChange}
      discountError=""
    />
  );
}

describe("AddDiscount", () => {
  afterEach(() => {
    cleanup();
  });

  it("calculates percentage discounts as the existing absolute discount value", () => {
    expect(calculatePercentageDiscount(200, 10)).toBe(20);
    expect(calculatePercentageDiscount(99.9, 15)).toBe(14.99);
  });

  it("accepts only whole non-negative percentage values", () => {
    expect(isWholePercentageValue("15")).toBe(true);
    expect(isWholePercentageValue("")).toBe(true);
    expect(isWholePercentageValue("-1")).toBe(false);
    expect(isWholePercentageValue("1.5")).toBe(false);
  });

  it("lets the user choose only one discount mode", () => {
    render(<AddDiscountHarness />);

    const amountInput = screen.getByPlaceholderText("0,00");
    fireEvent.change(amountInput, { target: { value: "1000" } });
    expect(amountInput).toHaveValue("10.00");

    fireEvent.click(screen.getByRole("button", { name: "sales.discount.percentage" }));
    const percentageInput = screen.getByLabelText("sales.enter.discount.percentage");

    expect(screen.queryByPlaceholderText("0,00")).not.toBeInTheDocument();

    fireEvent.change(percentageInput, { target: { value: "12" } });
    expect(percentageInput).toHaveValue("12");

    fireEvent.change(percentageInput, { target: { value: "12.5" } });
    expect(percentageInput).toHaveValue("12");

    fireEvent.click(screen.getByRole("button", { name: "sales.discount.amount" }));

    expect(screen.queryByLabelText("sales.enter.discount.percentage")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("0,00")).toHaveValue("");
  });
});
