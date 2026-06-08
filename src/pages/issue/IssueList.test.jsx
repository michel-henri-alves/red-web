import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import IssueList from "./IssueList";
import { fetchAllIssuesPaginated } from "../../shared/hooks/useIssues";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("../../shared/hooks/useDebounce", () => ({
  default: (value) => value,
}));

vi.mock("../../shared/hooks/useIssues", () => ({
  fetchAllIssuesPaginated: vi.fn(),
}));

vi.mock("../../components/ExpandableTable", () => ({
  default: ({ title }) => <div>{title}</div>,
}));

const mockPaginatedIssues = (issues = []) => {
  fetchAllIssuesPaginated.mockReturnValue({
    data: {
      pages: [
        {
          data: issues,
          page: 1,
          totalPages: 1,
        },
      ],
    },
    isLoading: false,
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  });
};

describe("IssueList", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("filters issues by workflow and risk with All as the default risk", () => {
    mockPaginatedIssues([{ _id: "issue-1", workflow: "Inventory" }]);

    render(<IssueList />);

    const riskFilter = screen.getByLabelText("issue.risk");

    expect(riskFilter).toHaveValue("");
    expect(screen.getByRole("option", { name: "all" })).toHaveValue("");
    expect(screen.getByRole("option", { name: "INFO" })).toHaveValue("INFO");
    expect(screen.getByRole("option", { name: "WARN" })).toHaveValue("WARN");
    expect(screen.getByRole("option", { name: "ERROR" })).toHaveValue("ERROR");
    expect(fetchAllIssuesPaginated).toHaveBeenLastCalledWith({ workflow: "", risk: "" }, 10);

    fireEvent.change(screen.getByPlaceholderText("tooltip.filter"), {
      target: { value: "Inventory" },
    });
    fireEvent.change(riskFilter, { target: { value: "WARN" } });

    expect(fetchAllIssuesPaginated).toHaveBeenLastCalledWith({ workflow: "Inventory", risk: "WARN" }, 10);
  });
});
