import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <aside className={`h-screen bg-blue-700 text-white p-4 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>

            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-blue-500 text-white px-2 py-2 rounded cursor-pointer"
                title={isSidebarOpen ? t("button.tooltip.reduce") : t("button.tooltip.expand")}
            >
                {isSidebarOpen ? "«" : "☰"}
            </button>

            <nav className="flex flex-col space-y-2">

                <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.home")}>
                    <span>🏠</span>
                    {isSidebarOpen && <span>{t("sidebar.home")}</span>}
                </Link>

                <Link to="/products" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.products")}>
                    <span>📦</span>
                    {isSidebarOpen && <span>{t("sidebar.products")}</span>}
                </Link>

                <Link to="/sectors" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.sectors")}>
                    <span>🌍</span>
                    {isSidebarOpen && <span>{t("sidebar.sectors")}</span>}
                </Link>

                <Link to="/sales" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.sales")}>
                    <span>💵💳</span>
                    {isSidebarOpen && <span>{t("sidebar.sales")}</span>}
                </Link>


                {/* <Link to="/camera" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>📷</span>
                    {isSidebarOpen && <span>Camera</span>}
                </Link> */}

                <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.read.barcode")}>
                    <span>𝄃𝄃𝄂𝄀𝄁𝄃</span>
                    {isSidebarOpen && <span>{t("sidebar.read.barcode")}</span>}
                </Link>

                <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2" title={t("sidebar.read.barcode")}>
                    <span>👨🏻‍💼</span>
                    {isSidebarOpen && <span>Michel Alves</span>}
                </Link>

                {/* <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>⚙️</span>
                    {isSidebarOpen && <span>Configurações</span>}
                </Link> */}

            </nav>
        </aside>
    );
}