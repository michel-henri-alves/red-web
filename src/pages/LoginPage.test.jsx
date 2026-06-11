import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import LoginPage, { normalizeLoginResponseData } from "./LoginPage";
import { loginUser } from "../shared/hooks/useUsers";

const executeLogin = vi.fn();

vi.mock("../shared/hooks/useUsers", () => ({
  loginUser: vi.fn(),
}));

const renderLoginPage = () => {
  loginUser.mockReturnValue({ mutateAsync: executeLogin });

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
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
