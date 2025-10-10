import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const { t } = useTranslation();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <aside className={`h-screen bg-[rgba(98,70,234)] text-white p-4 flex flex-col transition-all duration-100 ${isSidebarOpen ? "w-64" : "w-20"}`}>

            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-[rgba(59,89,152)] text-white text-2xl px-2 py-2 rounded cursor-pointer"
                title={isSidebarOpen ? t("button.tooltip.reduce") : t("button.tooltip.expand")}
            >
                {isSidebarOpen ? "«" : "☰"}
            </button>

            <nav className="flex flex-col space-y-2">

                <Link to="/" className="hover:bg-[rgba(59,89,152)] p-2 rounded flex items-center space-x-2" title={t("sidebar.home")}>
                    <span className='text-2xl'>🏠</span>
                    {isSidebarOpen && <span className='font-bold'>{t("sidebar.home")}</span>}
                </Link>

                <Link to="/products" className="hover:bg-[rgba(59,89,152)] p-2 rounded flex items-center space-x-2" title={t("sidebar.products")}>
                    <span className='text-2xl'>📦</span>
                    {isSidebarOpen && <span className='font-bold'>{t("sidebar.products")}</span>}
                </Link>

                <Link to="/sectors" className="hover:bg-[rgba(59,89,152)] p-2 rounded flex items-center space-x-2" title={t("sidebar.sectors")}>
                    <span className='text-2xl'>🏘️</span>
                    {isSidebarOpen && <span className='font-bold'>{t("sidebar.sectors")}</span>}
                </Link>

                <Link to="/sales" className="hover:bg-[rgba(59,89,152)] p-2 rounded flex items-center space-x-2" title={t("sidebar.sales")}>
                    <span className='text-2xl'>💲</span>
                    {isSidebarOpen && <span className='font-bold'>{t("sidebar.sales")}</span>}
                </Link>

                <Link to="/customers" className="hover:bg-[rgba(59,89,152)] p-2 rounded flex items-center space-x-2" title={t("sidebar.sales")}>
                    <span className='text-2xl'>🙋🏻</span>
                    {isSidebarOpen && <span className='font-bold'>{t("sidebar.customers")}</span>}
                </Link>
            </nav>
        </aside>
    );
}