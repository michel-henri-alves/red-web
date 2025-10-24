import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import { createPendings } from '../../../shared/hooks/usePendings'
import ActionButton from "../../../components/ActionButton"
import {
    Check
} from "lucide-react";
import { useWhatsAppMessage } from "../../../hooks/useWhatsAppMessage";


export default function CustomerAddDue({ updateBill, onClose, customer, due, isExpanded }) {

    const { t } = useTranslation();
    const [debt, setDebt] = useState(due);
    const [errors, setErrors] = useState({});
    const { openWhatsApp } = useWhatsAppMessage();

    const {
        mutate: creation,
        isLoading: isLoadingCreation,
    } = createPendings();
    const [form, setForm] = useState(customer || {});
    useEffect(() => {
        setForm(customer || {});
    }, [customer]);

    const notifyByWhatsApp = () => {
        const confirmed = window.confirm(t("notify.by.whatsapp"));
        if (confirmed) {
            const phone = t("message.phone.number", { "phoneNumber": customer.phone });
            const message = t("sales.debt.whatsapp", { value: due, owner: "Padaria Flor do Campo" });
            openWhatsApp(phone, message);
        }
    }

    const registerDebt = () => {
        console.log(customer)
        var debt = {
            "amount": due,
            "customerId": customer._id,
            "pendingType": "DEBIT"
        }

        creation(debt, {
            onSuccess: () => {
                setErrors({});
                notifyByWhatsApp();
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

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 text-2xl text-gray-700 m-5">

                    <section className="p-5 bg-gray-200 rounded-xl shadow-xl flex justify-center">
                        <label className="block p-5 font-bold">⚠️ {t("sales.debt.information", { input: debt })}</label>
                        <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("button.confirm")} onClick={registerDebt} icon={Check} />
                    </section>

                </motion.div>
            )}
        </AnimatePresence>
    );
}