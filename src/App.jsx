import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductPage from './pages/ProductPage';

const queryClient = new QueryClient();

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex bg-gray-100 text-gray-800 overflow-hidden">

        {/* Sidebar colapsável */}
        <aside
          className={`h-screen bg-blue-700 text-white p-4 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          {/* Botão de toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-6 text-white"
          >
            {isSidebarOpen ? "«" : "»"}
          </button>

          <nav className="flex flex-col space-y-2">
            <a href="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
              <span>🏠</span>
              {isSidebarOpen && <span>Dashboard</span>}
            </a>
            <a href="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
              <span>📦</span>
              {isSidebarOpen && <span>Produtos</span>}
            </a>
            <a href="#" className="hover:bg-blue-600 p-2 rounded flex items-center space-x-2">
              <span>⚙️</span>
              {isSidebarOpen && <span>Configurações</span>}
            </a>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <header className="bg-blue-600 text-white p-4 shadow">
            <h1 className="text-xl font-bold">Product Manager</h1>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <ProductPage />
          </main>

          <footer className="bg-blue-600 text-white p-4 text-center text-sm">
            © 2025 - All rights reserved.
          </footer>
        </div>
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}
