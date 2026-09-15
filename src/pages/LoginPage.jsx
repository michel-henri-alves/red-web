import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axiosClient from "../services/axiosClient";
import { loginUser, recoverUserPassword } from "../shared/hooks/useUsers";
import { mustChangeInitialPassword, useAuth } from "../context/AuthContext";

import { useTenant } from '../components/TenantProvider';

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const normalizeLoginResponseData = (data) => {
  const payload = typeof data?.body === "string"
    ? JSON.parse(data.body)
    : data?.body || data;

  return {
    accessToken: payload?.accessToken || payload?.token,
    user: payload?.user,
  };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const company = useTenant();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState(null);
  const { mutateAsync: executeLogin } = loginUser();
  const { mutateAsync: executeRecovery, isPending: recoveryPending } = recoverUserPassword();


  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError(null);

      const response = await executeLogin({ ...data, companyId: company.companyId });
      const loginData = normalizeLoginResponseData(response.data);

      if (!loginData.accessToken || loginData.user?.companyId !== company.companyId) {
        throw new Error("Login response missing access token");
      }

      login(loginData);

      navigate(
        mustChangeInitialPassword(loginData.user) ? "/change-password" : "/",
        { replace: true }
      );

    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  const requestRecovery = async () => {
    const companyId = company.companyId;
    const email = getValues("email")?.trim().toLowerCase();
    if (!companyId || !email) {
      setRecoveryMessage({ type: "error", text: "Informe o email." });
      return;
    }
    if (!z.string().email().safeParse(email).success) {
      setRecoveryMessage({ type: "error", text: "Informe um email válido." });
      return;
    }

    try {
      setRecoveryMessage(null);
      await executeRecovery({ companyId, email });
      setRecoveryMessage({
        type: "success",
        text: "Se os dados corresponderem a uma conta ativa, enviaremos uma senha temporária por email.",
      });
    } catch (requestError) {
      const throttled = requestError?.response?.status === 429;
      setRecoveryMessage({
        type: "error",
        text: throttled
          ? "Muitas tentativas. Aguarde um pouco antes de tentar novamente."
          : "Não foi possível solicitar a recuperação agora. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Entrar em {company.name}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              aria-label="Senha"
              autoComplete="current-password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="w-full text-blue-700 underline underline-offset-2"
            onClick={() => {
              setRecoveryOpen((current) => !current);
              setRecoveryMessage(null);
            }}
            aria-expanded={recoveryOpen}
          >
            Esqueci minha senha
          </button>

          {recoveryOpen && (
            <section aria-label="Recuperação de senha" className="space-y-3 border-t pt-4">
              <p className="text-sm text-gray-700">
                Use o email cadastrado nesta empresa.
              </p>
              <button
                type="button"
                disabled={recoveryPending}
                onClick={requestRecovery}
                className="w-full border border-blue-600 text-blue-700 py-2 rounded-lg disabled:opacity-50"
              >
                {recoveryPending ? "Solicitando..." : "Enviar senha temporária"}
              </button>
              {recoveryMessage && (
                <p role={recoveryMessage.type === "error" ? "alert" : "status"} className="text-sm text-center">
                  {recoveryMessage.text}
                </p>
              )}
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
