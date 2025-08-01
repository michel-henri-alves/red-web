import React from "react";
import { useTranslation } from 'react-i18next'


export default function ToggleSwitchWithText({ enabled, setEnabled }) {

    const { t } = useTranslation();

    return (
        <div>

            <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex items-center justify-center h-10 w-35 rounded-full transition-colors duration-300 text-xs font-medium cursor-pointer 
                ${enabled ? "bg-green-500 text-white" : "bg-red-300 text-red-700"}`
                }
            >
                <span
                    className={`absolute left-1 top-2 h-6 w-6 rounded-full shadow-lg transform transition-transform duration-300 
                    ${enabled ? "translate-x-26" : "translate-x-0"}`
                    }
                >🔊</span>
                <span className="z-10">{enabled ? t("sales.beep.on") : t("sales.beep.off")}</span>
            </button>
        </div>

    );
}
