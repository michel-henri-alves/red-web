import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { changeInitialPasswordUser } from "../../shared/hooks/useUsers";
import { formatApiErrorCause } from "../../shared/utils/apiErrorFormatter";

const passwordRules = [
  { id: "length", test: (value) => value.length >= 12, labelKey: "password.rule.length" },
  { id: "lowercase", test: (value) => /[a-z]/.test(value), labelKey: "password.rule.lowercase" },
  { id: "uppercase", test: (value) => /[A-Z]/.test(value), labelKey: "password.rule.uppercase" },
  { id: "number", test: (value) => /\d/.test(value), labelKey: "password.rule.number" },
  { id: "special", test: (value) => /[^A-Za-z0-9]/.test(value), labelKey: "password.rule.special" },
];

const schema = z.object({
  currentPassword: z.string().min(1, "current.password.is.required"),
  newPassword: z
    .string()
    .min(12, "password.at.least.12.characters")
    .regex(/[a-z]/, "password.must.include.lowercase")
    .regex(/[A-Z]/, "password.must.include.uppercase")
    .regex(/\d/, "password.must.include.number")
    .regex(/[^A-Za-z0-9]/, "password.must.include.special.character"),
  confirmPassword: z.string().min(1, "confirm.password.is.required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "password.confirmation.mismatch",
  path: ["confirmPassword"],
});

export default function ChangeInitialPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateUserSession } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const { mutateAsync: changePassword } = changeInitialPasswordUser();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword") || "";
  const strength = useMemo(
    () => passwordRules.filter((rule) => rule.test(newPassword)).length,
    [newPassword]
  );
  const strengthPercent = (strength / passwordRules.length) * 100;

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      setSuccess(false);
      await changePassword(data);
      updateUserSession({ requiresInitialPasswordChange: false });
      reset();
      setSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 900);
    } catch (err) {
      setApiError(formatApiErrorCause(err, t));
    }
  };

  const inputType = showPasswords ? "text" : "password";

  return (
    <section className="min-h-full flex items-center justify-center bg-white">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-[rgba(98,70,234)]">
            <ShieldCheck size={32} />
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("password.change.initial.title")}
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {t("password.change.initial.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PasswordField
            id="currentPassword"
            label={t("password.current")}
            type={inputType}
            register={register}
            error={errors.currentPassword?.message && t(errors.currentPassword.message)}
          />

          <PasswordField
            id="newPassword"
            label={t("password.new")}
            type={inputType}
            register={register}
            error={errors.newPassword?.message && t(errors.newPassword.message)}
          />

          <div>
            <div className="h-2 overflow-hidden rounded bg-gray-200">
              <div
                className="h-full bg-[rgba(98,70,234)] transition-all"
                style={{ width: `${strengthPercent}%` }}
              />
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {passwordRules.map((rule) => {
                const passed = rule.test(newPassword);
                return (
                  <li
                    key={rule.id}
                    className={`flex items-center gap-2 text-sm ${passed ? "text-green-700" : "text-gray-500"}`}
                  >
                    <CheckCircle2 size={16} className={passed ? "text-green-600" : "text-gray-300"} />
                    {t(rule.labelKey)}
                  </li>
                );
              })}
            </ul>
          </div>

          <PasswordField
            id="confirmPassword"
            label={t("password.confirm")}
            type={inputType}
            register={register}
            error={errors.confirmPassword?.message && t(errors.confirmPassword.message)}
          />

          <button
            type="button"
            onClick={() => setShowPasswords((value) => !value)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-[rgba(98,70,234)]"
          >
            {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPasswords ? t("password.hide") : t("password.show")}
          </button>

          {apiError && (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
              {apiError}
            </p>
          )}

          {success && (
            <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {t("password.changed.successfully")}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-[rgba(98,70,234)] px-4 py-3 font-medium text-white transition hover:bg-[rgba(78,52,214)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <KeyRound size={18} className="animate-pulse" /> : <LockKeyhole size={18} />}
            {isSubmitting ? t("password.changing") : t("password.change")}
          </button>
        </form>
      </div>
    </section>
  );
}

function PasswordField({ id, label, type, register, error }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete="new-password"
        {...register(id)}
        className="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[rgba(98,70,234)] focus:ring-2 focus:ring-[rgba(98,70,234,0.2)]"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
