import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ProductPage from '../pages/product/ProductPage';
import SectorPage from '../pages/sector/SectorPage';
import SalesPage from '../pages/sales/SalesPage';
import PosPage from '../pages/pos/PosPage';
import CustomerPage from '../pages/customer/CustomerPage';
import PaymentPage from '../pages/sales/payment/PaymentPage';
import BookletPage from '../pages/sales/booklet/BookletPage';


export default function routeConfig() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/sectors" element={<SectorPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/booklet" element={<BookletPage />} />
            {/* <Route path="/camera" element={<CameraTest />} /> */}
            {/* <Route path="/configuracoes" element={<div>Configurações</div>} /> */}
        </Routes>
    );
}