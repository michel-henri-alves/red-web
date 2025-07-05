import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from "react-i18next";

import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';

import ProductPage from './pages/ProductPage';
import CameraTest from './pages/CameraTest';

const queryClient = new QueryClient();

export default function App() {
  const { t } = useTranslation();

  return (

    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="bg-gray-200	h-screen flex flex-col">

          <header className="h-16 bg-blue-700 text-white flex items-center px-6 shadow">
            <h1 className="text-xl font-bold italic">{t("header.system.name")}</h1>
          </header>

          <div className="flex flex-1 overflow-hidden">

            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<div>Bem-vindo!</div>} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/camera" element={<CameraTest />} />
                <Route path="/configuracoes" element={<div>Configurações</div>} />
              </Routes>
            </main>
          </div>

          <ToastContainer />

          <footer className="bg-blue-700 text-white p-4 text-center text-sm">
            © {t("footer.copyright")}
          </footer>

        </div>
      </Router>
    </QueryClientProvider>
  );
}
