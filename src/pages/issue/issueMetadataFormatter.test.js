import { describe, expect, it } from "vitest";
import {
  formatIssueMetadataForDisplay,
  formatIssueMetadataForInput,
} from "./issueMetadataFormatter";

describe("issue metadata formatter", () => {
  it("formats inventory issue metadata objects for display", () => {
    expect(formatIssueMetadataForDisplay({
      productId: "product-1",
      salesId: "sale-1",
      date: "2026-06-05T12:00:00.000Z",
      quantity: 3,
      name: "Coffee",
      vendor: "Michel",
    })).toBe(
      "productId: product-1 | salesId: sale-1 | date: 2026-06-05T12:00:00.000Z | quantity: 3 | name: Coffee | vendor: Michel"
    );
  });

  it("serializes metadata objects for text inputs", () => {
    expect(formatIssueMetadataForInput({ productId: "product-1", quantity: 3 }))
      .toBe('{"productId":"product-1","quantity":3}');
  });

  it("keeps existing string metadata unchanged", () => {
    expect(formatIssueMetadataForDisplay("manual note")).toBe("manual note");
    expect(formatIssueMetadataForInput("manual note")).toBe("manual note");
  });
});
