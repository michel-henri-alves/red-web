import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

const mocks = vi.hoisted(() => ({
  useLast5DaysSales: vi.fn(),
  useTodaySalesTotal: vi.fn(),
}));

vi.mock("../shared/hooks/useDashboard", () => ({
  useLast5DaysSales: mocks.useLast5DaysSales,
  useTodaySalesTotal: mocks.useTodaySalesTotal,
}));

vi.mock("./SalesChart", () => ({
  default: ({ data }) => (
    <output aria-label="chart-data">{JSON.stringify(data)}</output>
  ),
}));

const baseQueryState = {
  data: [],
  isLoading: false,
  isError: false,
  isFetching: false,
  refetch: vi.fn(),
};

const baseTodaySalesState = {
  data: 0,
  isLoading: false,
  isError: false,
  isFetching: false,
  refetch: vi.fn(),
};

describe("Dashboard sales chart", () => {
  beforeEach(() => {
    mocks.useLast5DaysSales.mockReturnValue(baseQueryState);
    mocks.useTodaySalesTotal.mockReturnValue(baseTodaySalesState);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows a loading state while last 5 days sales are loading", () => {
    mocks.useLast5DaysSales.mockReturnValue({
      ...baseQueryState,
      isLoading: true,
    });

    render(<Dashboard />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando vendas...");
  });

  it("shows an empty state when there are no last 5 days sales", () => {
    render(<Dashboard />);

    expect(screen.getByText("Nenhuma venda encontrada nos últimos 5 dias.")).toBeInTheDocument();
  });

  it("shows an error state with retry when sales cannot be loaded", () => {
    const refetch = vi.fn();
    mocks.useLast5DaysSales.mockReturnValue({
      ...baseQueryState,
      isError: true,
      refetch,
    });

    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(screen.getByText("Não foi possível carregar as vendas dos últimos 5 dias.")).toBeInTheDocument();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders the Sales Last 5 Days chart with API data", () => {
    mocks.useLast5DaysSales.mockReturnValue({
      ...baseQueryState,
      data: [
        { day: "21/05", sales: 120.5 },
        { day: "22/05", sales: 98.25 },
      ],
    });

    render(<Dashboard />);

    expect(screen.getByLabelText("chart-data")).toHaveTextContent(
      JSON.stringify([
        { day: "21/05", sales: 120.5 },
        { day: "22/05", sales: 98.25 },
      ])
    );
  });

  it("renders today's sales total with two decimal places", () => {
    mocks.useTodaySalesTotal.mockReturnValue({
      ...baseTodaySalesState,
      data: 120.5,
    });

    render(<Dashboard />);

    expect(screen.getByText("R$ 120,50")).toBeInTheDocument();
    expect(screen.queryByText("R$ 5.350,32")).not.toBeInTheDocument();
  });

  it("shows today's sales loading state", () => {
    mocks.useTodaySalesTotal.mockReturnValue({
      ...baseTodaySalesState,
      isLoading: true,
    });

    render(<Dashboard />);

    expect(screen.getByText("Carregando vendas de hoje...")).toBeInTheDocument();
  });

  it("shows today's sales empty state when total is zero", () => {
    render(<Dashboard />);

    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma venda registrada hoje.")).toBeInTheDocument();
  });

  it("shows today's sales error state with retry", () => {
    const refetch = vi.fn();
    mocks.useTodaySalesTotal.mockReturnValue({
      ...baseTodaySalesState,
      isError: true,
      refetch,
    });

    render(<Dashboard />);
    fireEvent.click(screen.getAllByRole("button", { name: "Tentar novamente" })[0]);

    expect(screen.getByText("Não foi possível carregar as vendas de hoje.")).toBeInTheDocument();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
