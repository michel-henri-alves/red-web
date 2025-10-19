import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import BookletButtons from './BookletButtons';

export default function BookletDetails({ pending, isExpanded }) {
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
                            <BookletButtons pending={pending} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}