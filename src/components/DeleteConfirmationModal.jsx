import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import ActionButton from "./ActionButton";

export default function DeleteConfirmationModal({ onClose, deleteMethod, deleteId, description }) {
  const { t } = useTranslation();
  const { mutate: remove, isLoading } = deleteMethod();
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  const handleDelete = () => {
    remove(deleteId, {
      onSuccess: () => {
        toast.success(t("toast.delete.success", { description }));
        onClose();
      },
      onError: () => {
        toast.error(t("toast.delete.error", { description }));
      }
    });
  };

  return (
    <div className="w-full max-w-xl sm:max-w-xl bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-xl shadow-xl space-y-6 mx-auto text-center">
      
      {/* Título */}
      <h1
        id="delete-confirmation-title"
        className="text-base sm:text-xl font-medium text-gray-800 dark:text-gray-200"
      >
        {t("delete.confirmation.message", { description })}
      </h1>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-3 pt-2">
        <ActionButton
          type="button"
          bgColor="red"
          onClick={onClose}
          text={isLoading ? t("button.cancelling") : t("button.cancel")}
          icon={isLoading ? "⏳" : "✖"}
          disabled={isLoading}
          ref={cancelButtonRef}
        />
        <ActionButton
          type="button"
          bgColor="blue"
          onClick={handleDelete}
          text={isLoading ? t("button.deleting") : t("button.confirm")}
          icon={isLoading ? "⏳" : "✔"}
          additionalStyle="w-full sm:w-auto transition-transform duration-200 hover:-translate-y-0.5"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
