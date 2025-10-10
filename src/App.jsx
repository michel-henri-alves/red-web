import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from "react-i18next";

import FloatingCashierButton from "./components/FloatingCashierButton";
import Sidebar from './components/Sidebar';
import RouteConfig from './components/RoutesConfig';

const queryClient = new QueryClient();

export default function App() {

  const { t } = useTranslation();

  return (

    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="bg-gray-200	h-screen flex flex-col">

          <header className="h-16 bg-[rgba(98,70,234)] text-white flex items-center justify-center px-6 shadow">
            <img src="/m4_white.png" alt="M4" className="h-15 w-auto" />
          </header>

          <div className="flex flex-1 overflow-hidden">

            <Sidebar />

            <main className="bg-[rgba(255,255,254)] flex-1 p-6 overflow-y-auto">
              <RouteConfig /> 
            </main>
          </div>

          <FloatingCashierButton />

          <ToastContainer />

          <footer className="bg-[rgba(98,70,234)] text-white p-4 text-center text-sm">
            © {t("footer.copyright")}
          </footer>

        </div>
      </Router>
    </QueryClientProvider>
  );
}