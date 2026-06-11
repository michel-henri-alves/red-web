import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomerForm from "./CustomerForm";
import { createCustomer, updateCustomer } from "../../shared/hooks/useCustomers";

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

vi.mock("../../shared/hooks/useCustomers", () => ({
  createCustomer: vi.fn(),
  updateCustomer: vi.fn(),
}));

describe("CustomerForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the default PF form fields", () => {
    createCustomer.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateCustomer.mockReturnValue({ mutateAsync: updateMutation });

    render(<CustomerForm customer={{ customerType: "PF" }} />);

    expect(screen.getByText(/customer.type.pf/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("customer.nickname")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("customer.cpf")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("customer.cep")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("customer.phone2")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("customer.cnpj")).not.toBeInTheDocument();
  });

  it("masks CPF and CEP on PF form and submits only digits", async () => {
    createMutation.mockResolvedValue({});
    createCustomer.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateCustomer.mockReturnValue({ mutateAsync: updateMutation });

    render(<CustomerForm customer={{ customerType: "PF" }} />);

    fireEvent.change(screen.getByPlaceholderText("customer.name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cpf"), { target: { value: "12345678901" } });
    fireEvent.change(screen.getByPlaceholderText("customer.phone"), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByPlaceholderText("customer.phone2"), { target: { value: "11888888888" } });
    fireEvent.change(screen.getByPlaceholderText("customer.address"), { target: { value: "Rua Central, 10" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cep"), { target: { value: "12345678" } });

    expect(screen.getByPlaceholderText("customer.cpf")).toHaveValue("123.456.789-01");
    expect(screen.getByPlaceholderText("customer.cep")).toHaveValue("12345-678");

    fireEvent.click(screen.getByRole("button", { name: /button.save/i }));

    await waitFor(() => expect(createMutation).toHaveBeenCalledWith(expect.objectContaining({
      customerType: "PF",
      cpf: "12345678901",
      phone2: "11888888888",
      cep: "12345678",
    })));
    expect(createMutation.mock.calls[0][0].cnpj).toBeUndefined();
  });

  it("submits PJ fields with a nested contact object", async () => {
    createMutation.mockResolvedValue({});
    createCustomer.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateCustomer.mockReturnValue({ mutateAsync: updateMutation });

    render(<CustomerForm customer={{ customerType: "PJ" }} />);

    expect(screen.getByText("customer.company.section")).toBeInTheDocument();
    expect(screen.getByText("customer.contact.section")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("customer.name"), { target: { value: "Acme LTDA" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cnpj"), { target: { value: "12345678000190" } });
    fireEvent.change(screen.getByPlaceholderText("customer.address"), { target: { value: "Rua Central, 10" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cep"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByPlaceholderText("customer.phone1"), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByPlaceholderText("customer.email"), { target: { value: "empresa@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("customer.contact.name"), { target: { value: "Maria" } });
    fireEvent.change(screen.getByPlaceholderText("customer.contact.phone"), { target: { value: "11888888888" } });
    fireEvent.change(screen.getByPlaceholderText("customer.contact.email"), { target: { value: "maria@example.com" } });

    expect(screen.getByPlaceholderText("customer.cnpj")).toHaveValue("12.345.678/0001-90");
    expect(screen.getByPlaceholderText("customer.cep")).toHaveValue("12345-678");

    fireEvent.click(screen.getByRole("button", { name: /button.save/i }));

    await waitFor(() => expect(createMutation).toHaveBeenCalledWith(expect.objectContaining({
      customerType: "PJ",
      name: "Acme LTDA",
      cnpj: "12345678000190",
      contact: {
        name: "Maria",
        phone: "11888888888",
        email: "maria@example.com",
      },
    })));
  });

  it("submits PJ payload when contact fields are empty", async () => {
    createMutation.mockResolvedValue({});
    createCustomer.mockReturnValue({ mutateAsync: createMutation, isLoading: false });
    updateCustomer.mockReturnValue({ mutateAsync: updateMutation });

    render(<CustomerForm customer={{ customerType: "PJ" }} />);

    fireEvent.change(screen.getByPlaceholderText("customer.name"), { target: { value: "Acme LTDA" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cnpj"), { target: { value: "12345678000190" } });
    fireEvent.change(screen.getByPlaceholderText("customer.address"), { target: { value: "Rua Central, 10" } });
    fireEvent.change(screen.getByPlaceholderText("customer.cep"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByPlaceholderText("customer.phone1"), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByPlaceholderText("customer.email"), { target: { value: "empresa@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /button.save/i }));

    await waitFor(() => expect(createMutation).toHaveBeenCalledWith(expect.objectContaining({
      customerType: "PJ",
    })));
    expect(createMutation.mock.calls[0][0].contact).toBeUndefined();
  });
});
