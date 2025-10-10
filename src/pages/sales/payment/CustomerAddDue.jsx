import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import { createPendings } from '../../../shared/hooks/usePendings'


export default function CustomerAddDue({ updateBill, onClose, customer, due, isExpanded }) {

    const { t } = useTranslation();
    const [debt, setDebt] = useState(due);
    const [errors, setErrors] = useState({});

    const {
        mutate: creation,
        isLoading: isLoadingCreation,
        isSuccess: isSuccessCreation,
        isError: isErrorCreation,
        error: errorCreation,
        reset: resetCreation,
    } = createPendings();
    const [form, setForm] = useState(customer || {});
    useEffect(() => {
        setForm(customer || {});
    }, [customer]);

    const registerDebt = () => {
        var debt = {
            "value": due,
            "customerId": customer._id,
            "pendingType": "DEBIT"
        }

        creation(debt, {
            onSuccess: () => {
                setErrors({});
                const confirmed = window.confirm('Deseja notificar nosso cliente pelo Whatsapp?');
                if (confirmed) {
                    notifyCustomer();
                }
                updateBill();
                if (onClose) onClose()
                toast.success(t("toast.due.add", { name: customer.name, value: due }));

            },
            onError: (error) => {
                console.error(error);
                toast.error(t("toast.creation.error", { description: customer.name, errorCause: error.response.data.error }));
            },
        });

    }

    const notifyCustomer = () => {
        const phone = "55" + customer.phone;
        const message = t("sales.debt.whatsapp", { value: due, owner: "Padaria Flor do Campo" });
        const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }


    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 text-2xl text-gray-700 m-5">

                    <label className="block p-5">⚠️ {t("sales.debt.information", { input: debt.toFixed(2) })}</label>
                    <button
                        type="button"
                        onClick={registerDebt}
                        className="w-full py-1 px-1 bg-gray-300 text-gray-350 rounded cursor-pointer transition
                                hover:bg-blue-700 text-white active:bg-blue-200
                                focus:bg-blue-700 text-white active:bg-blue-200"
                    >
                        📝 {t("button.confirm")}
                    </button>

                </motion.div>
            )}
        </AnimatePresence>
    );
}