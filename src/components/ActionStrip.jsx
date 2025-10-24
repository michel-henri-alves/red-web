import React from "react";
import { useTranslation } from 'react-i18next'
import ActionButton from "./ActionButton";
import formatCurrency from "../shared/utils/formatCurrency";
import {
    HandCoins,
    MousePointerClick,
    BrushCleaning,
    Trash
} from "lucide-react";


function ActionStrip({ refs, onFinalize, onManualAdd, onClean, onOpenDelete, total, isBeepEnabled, toggleBeep }) {

    const { t } = useTranslation();
    return (
        <section className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <ActionButton text={t("button.finalize.sale") + " (F1)"} icon={HandCoins} bgColor="[rgba(98,70,234)]" onClick={onFinalize} ref={refs.f1} />
                <ActionButton text={t("button.insert.manually") + " (F2)"} icon={MousePointerClick} bgColor="[rgba(98,70,234)]" onClick={onManualAdd} ref={refs.f2} />
                <ActionButton text={t("button.clean") + " (F3)"} icon={BrushCleaning} bgColor="[rgba(98,70,234)]" onClick={onClean} ref={refs.f3} />
                <ActionButton text={t("button.delete") + " (F4)"} icon={Trash} bgColor="[rgba(98,70,234)]" onClick={onOpenDelete} ref={refs.f4} />
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-lg font-mono font-bold">
                    <div className="text-xs text-gray-500 dark:text-gray-300">{t("pos.bill.total")}</div>
                    <div className="text-2xl text-green-600 dark:text-green-400">{formatCurrency(total)}</div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300 mr-1">{t("sound")}</label>
                    <div className="flex items-center gap-2">
                        <input ref={refs.f6} type="checkbox" checked={isBeepEnabled} onChange={toggleBeep} className="w-5 h-5 rounded" />
                        <span>{isBeepEnabled ? "🎶" : "🔇"}</span>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default React.memo(ActionStrip);
