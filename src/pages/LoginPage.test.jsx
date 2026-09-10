import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import LoginPage, { normalizeLoginResponseData } from "./LoginPage";
import { loginUser, recoverUserPassword } from "../shared/hooks/useUsers";

const executeLogin = vi.fn();
const executeRecovery = vi.fn();

vi.mock("../shared/hooks/useUsers", () => ({
  loginUser: vi.fn(),
  recoverUserPassword: vi.fn(),
}));

const renderLoginPage = () => {
  loginUser.mockReturnValue({ mutateAsync: executeLogin });
  recoverUserPassword.mockReturnValue({ mutateAsync: executeRecovery, isPending: false });

  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("normalizeLoginResponseData", () => {
  it("normalizes direct and Lambda body login payloads", () => {
    expect(normalizeLoginResponseData({
      accessToken: "direct-token",
      user: { name: "Michel" },
    })).toEqual({
      accessToken: "direct-token",
      user: { name: "Michel" },
    });

    expect(normalizeLoginResponseData({
      body: JSON.stringify({
        token: "lambda-token",
        user: { name: "Michel" },
      }),
    })).toEqual({
      accessToken: "lambda-token",
      user: { name: "Michel" },
    });
  });
});

describe("LoginPage", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("persists a token returned in a Lambda-style body payload", async () => {
    executeLogin.mockResolvedValue({
      data: {
        body: JSON.stringify({
          accessToken: "token-123",
          user: { name: "Michel", role: "admin", companyId: "company-1" },
        }),
      },
    });

    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "michel@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Identificador da empresa"), {
      target: { value: "company-1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(localStorage.getItem("token")).toBe("token-123"));
    expect(JSON.parse(localStorage.getItem("user"))).toMatchObject({
      name: "Michel",
      role: "admin",
      companyId: "company-1",
    });
  });

  it("shows an error and does not persist a session when login response has no token", async () => {
    executeLogin.mockResolvedValue({
      data: {
        user: { name: "Michel" },
      },
    });

    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "michel@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Identificador da empresa"), {
      target: { value: "company-1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("REQ-WEB-RECOVERY-003 requests recovery and shows generic accepted feedback", async () => {
    executeRecovery.mockResolvedValue({ data: { message: "password.recovery.request.accepted" } });
    renderLoginPage();

    fireEvent.change(screen.getByLabelText("Identificador da empresa"), { target: { value: "company-1" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "michel@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueci minha senha" }));
    fireEvent.click(screen.getByRole("button", { name: "Enviar senha temporária" }));

    await waitFor(() => expect(executeRecovery).toHaveBeenCalledWith({
      companyId: "company-1",
      email: "michel@example.com",
    }));
    expect(await screen.findByRole("status")).toHaveTextContent("Se os dados corresponderem");
  });

  it("rejects malformed recovery email before sending a request", () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText("Identificador da empresa"), { target: { value: "company-1" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid" } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueci minha senha" }));
    fireEvent.click(screen.getByRole("button", { name: "Enviar senha temporária" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Informe um email válido.");
    expect(executeRecovery).not.toHaveBeenCalled();
  });

  it("REQ-WEB-RECOVERY-002 requires company and email before recovery", () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole("button", { name: "Esqueci minha senha" }));
    fireEvent.click(screen.getByRole("button", { name: "Enviar senha temporária" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Informe o identificador da empresa e o email");
    expect(executeRecovery).not.toHaveBeenCalled();
  });
});
