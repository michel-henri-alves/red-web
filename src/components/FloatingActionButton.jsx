import React from "react";
import { useTranslation } from "react-i18next";

export default function FloatingActionButton({ onClick, domain }) {
  const { t } = useTranslation();

  return (
    <button
      title={t("button.tooltip.form", {domain: domain})}
      onClick={onClick}
      className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer"
    >
      <h1>✚</h1>
    </button>
  );
}