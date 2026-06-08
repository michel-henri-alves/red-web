import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import IssueButtons from './IssueButtons';
import formatDate from "../../shared/utils/dateUtils";
import InfoTag from '../../components/InfoTag';
import { formatIssueMetadataForDisplay } from "./issueMetadataFormatter";

export default function IssueDetails({ issue, isExpanded }) {
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
                            <InfoTag inputData={issue.internalId} label={t("issue.internalId")} />
                            <InfoTag inputData={issue.workflow} label={t("issue.workflow")} />
                            <InfoTag inputData={t(issue.status)} label={t("issue.status")} />
                            <InfoTag inputData={t(issue.risk)} label={t("issue.risk")} />
                            <InfoTag inputData={issue.sponsor} label={t("issue.sponsor")} />
                            <InfoTag inputData={issue.details} label={t("issue.details")} />
                            <InfoTag inputData={formatIssueMetadataForDisplay(issue.metadata)} label={t("issue.metadata")} />
                            <InfoTag inputData={issue.createdBy} label={t("created.by")} />
                            <InfoTag inputData={formatDate(issue.createdAt)} label={t("created.at")} />
                            <InfoTag inputData={issue.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={formatDate(issue.updatedAt)} label={t("updated.at")} />
                        </div>
                        <IssueButtons issue={issue} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
