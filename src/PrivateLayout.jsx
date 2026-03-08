import { Outlet } from "react-router-dom";
import MenuResponsive from "./components/MenuResponsive";
import FloatingCashierButton from "./components/FloatingCashierButton";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";

export default function PrivateLayout() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200 h-screen flex flex-col">
      {/* <header className="h-16 bg-[rgba(98,70,234)] text-white flex items-center justify-center px-6 shadow">
        <img src="/m4_white.png" alt="M4" className="h-15 w-auto" />
      </header> */}
      <Header />


      <div className="flex flex-1 overflow-hidden">
        <MenuResponsive />

        <main className="bg-[rgba(255,255,254)] flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <FloatingCashierButton />
      <ToastContainer />

      <footer className="bg-[rgba(98,70,234)] text-white p-4 text-center text-sm">
        © {t("footer.copyright")}
      </footer>
    </div>
  );
}
