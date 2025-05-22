import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductPage from './pages/ProductPage';

const queryClient = new QueryClient();

export default function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800 overflow-hidden">

      <aside
        className={`absolute md:static inset-y-0 left-0 z-30 w-64 bg-blue-700 text-white p-6 space-y-4 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="hover:bg-blue-600 p-2 rounded">
            Dashboard
          </a>
          <a href="#" className="hover:bg-blue-600 p-2 rounded">
            Produtos
          </a>
          <a href="#" className="hover:bg-blue-600 p-2 rounded">
            Configurações
          </a>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">

        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold">Product Manager</h1>
          {/* Botão de menu em telas pequenas */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <ProductPage />
        </main>

        <footer className="bg-blue-600 text-white p-4 text-center text-sm">
          © 2025 - All rights reserved.
        </footer>

      </div>
    </div>
  );
}
