import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <aside className={`h-screen bg-blue-700 text-white p-4 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mb-6 text-white"
            >
                {isSidebarOpen ? "«" : "»"}
            </button>

            <nav className="flex flex-col space-y-2">
                <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>🏠</span>
                    {isSidebarOpen && <span>Home</span>}
                </Link>
                <Link to="/products" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>📦</span>
                    {isSidebarOpen && <span>Produtos</span>}
                </Link>
                <Link to="/products" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>𝄃𝄃𝄂𝄂𝄀𝄁𝄃𝄂𝄂𝄃</span>
                    {isSidebarOpen && <span>Código de barras</span>}
                </Link>
                <Link to="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
                    <span>⚙️</span>
                    {isSidebarOpen && <span>Configurações</span>}
                </Link>
            </nav>
        </aside>

    );
}