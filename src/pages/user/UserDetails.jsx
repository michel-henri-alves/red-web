import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import formatDate from "../../shared/utils/dateUtils";
import UserButtons from './UserButtons';
import InfoTag from '../../components/InfoTag';


export default function UserDetails({ user, isExpanded }) {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 pb-4 text-sm text-gray-700">
                    <div className="space-y-4 bg-white mt-6 p-6 text-2xl">
                        <div className="flex flex-wrap gap-3">
                            <InfoTag inputData={user.name} label={t("user.name")} />
                            <InfoTag inputData={user.username} label={t("user.username")} />
                            <InfoTag inputData={user.email} label={t("user.email")} />
                            <InfoTag inputData={t(user.role)} label={t("user.role")} />
                            <InfoTag inputData={user.createdBy} label={t("created.by")} />
                            <InfoTag inputData={formatDate(user.createdAt)} label={t("user.createdAt")} />
                            <InfoTag inputData={user.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={formatDate(user.updatedAt)} label={t("user.updatedAt")} />
                        </div>
                        <UserButtons user={user} />
                    </div>


                </motion.div>
            )}
        </AnimatePresence>
    );
}
