import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import ActionButton from "./ActionButton";
import {
 Check,
 Hourglass,
 X,
} from "lucide-react";

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
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || "toast.delete.error";
        toast.error(t(errorMessage));
      }
    });
  };

  return (
    <div>

      <section className="p-5 bg-gray-200 rounded-xl shadow-xl">
        <h1
          id="delete-confirmation-title"
          className="flex flex-col sm:flex-row sm:justify-center gap-3 pt-2 font-bold"
        >
          {t("delete.confirmation.message", { description })}
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 pt-2">
          <ActionButton
            type="button"
            bgColor="[rgba(98,70,234)]"
            onClick={onClose}
            text={isLoading ? t("button.cancelling") : t("button.cancel")}
            icon={isLoading ? Hourglass : X}    
            disabled={isLoading}
            ref={cancelButtonRef}
          />
          <ActionButton
            type="button"
            bgColor="[rgba(98,70,234)]"
            onClick={handleDelete}
            text={isLoading ? t("button.deleting") : t("button.confirm")}
            icon={isLoading ? Hourglass : Check}
            additionalStyle="w-full sm:w-auto transition-transform duration-200 hover:-translate-y-0.5"
            disabled={isLoading}
          />
        </div>
      </section>
    </div>
  );
}
