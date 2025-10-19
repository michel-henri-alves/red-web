import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExpandableTable({ index, title, item, expandedDiv }) {

    const { t } = useTranslation();

    const [expanded, setExpanded] = useState(null);
    const toggleExpand = (code) => setExpanded(expanded === code ? null : code);
    const isExpanded = expanded === index;

    return (
        <div
            key={index}
            className="bg-white p-4 rounded-xl
                border-b-2 border-l-2 border-t border-r
                border-b-gray-400 border-l-gray-400 border-t-gray-200 border-r-gray-200
                shadow-md hover:shadow-lg transition-shadow"
        >
            <button
                onClick={() => toggleExpand(index)}
                className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
                <span className="font-semibold">{title}</span>
                <span>
                    {isExpanded ? "▲" : "▼"}
                </span>
            </button>
            {expandedDiv && expandedDiv(item, isExpanded)}
        </div>
    );
}