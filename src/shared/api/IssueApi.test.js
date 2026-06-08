import { describe, expect, it, vi, afterEach } from "vitest";
import axiosClient from "../utils/apiBaseUrl";
import { create, fetchPaginated, update } from "./IssueApi";

vi.mock("../utils/apiBaseUrl", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("IssueApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends workflow, risk, status, and pagination filters for paginated issues", () => {
    fetchPaginated({ workflow: "Inventory", risk: "WARN", status: "OPEN" }, 2, 20);

    expect(axiosClient.get).toHaveBeenCalledWith("/issues", {
      params: {
        workflow: "Inventory",
        risk: "WARN",
        status: "OPEN",
        page: 2,
        limit: 20,
      },
    });
  });

  it("omits empty filters so All risk does not constrain results", () => {
    fetchPaginated({ workflow: "", risk: "", status: "" }, 1, 10);

    expect(axiosClient.get).toHaveBeenCalledWith("/issues", {
      params: {
        page: 1,
        limit: 10,
      },
    });
  });

  it("sends action in create payload", () => {
    const payload = {
      workflow: "Inventory audit",
      details: "Inventory issue details",
      risk: "WARN",
      action: "Review stock movements",
    };

    create(payload);

    expect(axiosClient.post).toHaveBeenCalledWith("/issues", payload);
  });

  it("sends action in update payload", () => {
    const payload = {
      workflow: "Inventory audit",
      details: "Inventory issue details",
      risk: "WARN",
      status: "DOING",
      action: "Review stock movements",
    };

    update("issue-1", payload);

    expect(axiosClient.put).toHaveBeenCalledWith("/issues/issue-1", payload);
  });
});
