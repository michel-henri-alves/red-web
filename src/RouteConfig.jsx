import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/product/ProductPage";
import SectorPage from "./pages/sector/SectorPage";
import SalesPage from "./pages/sales/SalesPage";
import PosPage from "./pages/pos/PosPage";
import CustomerPage from "./pages/customer/CustomerPage";
import PaymentPage from "./pages/sales/payment/PaymentPage";
import BookletPage from "./pages/sales/booklet/BookletPage";
import UserPage from "./pages/user/UserPage";
import ChangeInitialPassword from "./pages/user/ChangeInitialPassword";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";


export default function RouteConfig() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rotas privadas */}
      <Route
        element={
          <PrivateRoute>
            <PrivateLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/sectors" element={<SectorPage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/sales" element={
          <RoleRoute allowedRoles={["admin", "user"]}>
            <SalesPage />
          </RoleRoute>
        }
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/booklet" element={<BookletPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/change-password" element={<ChangeInitialPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
}
