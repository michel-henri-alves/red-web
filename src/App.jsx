import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import ProductPage from './pages/ProductPage';
import CameraTest from './pages/CameraTest';

import Sidebar from './components/Sidebar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex bg-gray-100 text-gray-800 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow">
              <h1 className="text-xl font-bold">Product Manager</h1>
            </header>

            {/* Aqui o componente da rota será renderizado */}
            <main className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<div>Bem-vindo!</div>} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/camera" element={<CameraTest />} />
                <Route path="/configuracoes" element={<div>Configurações</div>} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white p-4 text-center text-sm">
              © 2025 - All rights reserved.
            </footer>
          </div>

          <ToastContainer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
