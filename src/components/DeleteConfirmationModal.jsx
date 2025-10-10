import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";


export default function DeleteConfirmationModal({ onClose, deleteMethod, deleteId, description }) {
    const { t } = useTranslation();
    const { mutate: remove } = deleteMethod();

    const handleDelete = () => {
        remove(deleteId);
        onClose();
        toast.success(t("toast.delete.success", { description: description }))
    }


    return (
        <div className="space-y-4 bg-white p-6 rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)]">
            <p><strong>{t("delete.confirmation.message", { description: description })}</strong></p>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={() => { onClose() }}
                    className="px-4 py-2 text-white bg-red-500 
                               hover:bg-red-700 rounded cursor-pointer"
                >
                    ✖ &nbsp;{t("button.cancel")}
                </button>
                <button
                    onClick={() => { handleDelete() }}
                    className="px-4 py-2 text-white bg-green-500 
                               hover:bg-green-700 text-white rounded cursor-pointer"
                >
                    ✔ &nbsp;{t("button.confirm")}
                </button>
            </div>
        </div>
    );
};

