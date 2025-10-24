import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import SectorButtons from './SectorButtons';
import formatDate from "../../shared/utils/dateUtils";
import InfoTag from '../../components/InfoTag';

export default function SectorDetails({ sector, isExpanded }) {
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
                            <InfoTag inputData={sector.createdBy} label={t("created.by")} />
                            <InfoTag inputData={formatDate(sector.createdAt)} label={t("created.at")} />
                            <InfoTag inputData={sector.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={formatDate(sector.updatedAt)} label={t("updated.at")} />
                            <InfoTag inputData={sector.smartCode} label={t("sector.barcode")} />
                        </div>
                        <SectorButtons sector={sector} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}