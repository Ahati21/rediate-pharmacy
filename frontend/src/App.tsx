import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import AdminDashboard from './pages/AdminDashboard';
import InventoryOverview from './pages/InventoryOverview';
import AddMedicine from './pages/AddMedicine';
import EditMedicine from './pages/EditMedicine';
import MedicineSuccess from './pages/MedicineSuccess';
import ManagePharmacists from './pages/ManagePharmacists';
import AddPharmacist from './pages/AddPharmacist';
import EditPharmacist from './pages/EditPharmacist';
import PharmacistSuccess from './pages/PharmacistSuccess';
import MedicationSearch from './pages/MedicationSearch';
import Cart from './pages/Cart';
import DeliveryDetails from './pages/DeliveryDetails';
import Checkout from './pages/Checkout';
import ScriptUpload from './pages/ScriptUpload';
import PrescriptionApproved from './pages/PrescriptionApproved';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import CustomerHome from './pages/CustomerHome';
import PharmacistQueue from './pages/PharmacistQueue';
import ClinicalReview from './pages/ClinicalReview';
import SalesReport from './pages/SalesReport';
import CheckoutSuccess from './pages/CheckoutSuccess';
import { useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { UserRole } from './types';
import PaymentPage from "./pages/PaymentPage";

function homeForRole(role: UserRole) {
  if (role === 'pharmacist') return '/pharmacist/queue';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
}

export default function App() {
  const { isLoggedIn, role, isAuthLoading } = useAuth();
  const location = useLocation();

  const isCheckoutFunnel = ['/cart', '/delivery', '/checkout', '/success', '/tracking', '/prescription-approved', '/upload-script'].includes(location.pathname);
  const showGlobalNav = isLoggedIn && !isCheckoutFunnel;
  const requireLogin = (page: React.ReactElement) => (isLoggedIn ? page : <Navigate to="/login" replace />);
  const requireRole = (allowedRoles: UserRole[], page: React.ReactElement) =>
    isLoggedIn && allowedRoles.includes(role) ? page : <Navigate to={isLoggedIn ? homeForRole(role) : '/login'} replace />;

  if (isAuthLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0F172A]">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-lg dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#004A8F]">Rediate Pharmacy</p>
            <p className="mt-3 text-sm font-medium text-[#6B7280] dark:text-slate-400">Restoring your session...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-body bg-background text-on-background dark:bg-[#0F172A] dark:text-slate-200">
        {showGlobalNav && <Header />}

        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-success" element={<RegisterSuccess />} />

            <Route path="/" element={requireLogin(role === 'customer' ? <CustomerHome /> : role === 'pharmacist' ? <PharmacistQueue /> : <AdminDashboard />)} />
            <Route path="/search" element={requireRole(['customer'], <MedicationSearch />)} />
            <Route path="/cart" element={requireRole(['customer'], <Cart />)} />
            <Route path="/delivery" element={requireRole(['customer'], <DeliveryDetails />)} />
            <Route path="/checkout" element={requireRole(['customer'], <Checkout />)} />
            <Route path="/upload-script" element={requireRole(['customer'], <ScriptUpload />)} />
            <Route path="/prescription-approved" element={requireRole(['customer'], <PrescriptionApproved />)} />
            <Route path="/success" element={requireRole(['customer'], <OrderSuccess />)} />
            <Route path="/tracking" element={requireRole(['customer'], <OrderTracking />)} />
            <Route path="/payment/:orderId" element={requireRole(['customer'], <PaymentPage />)} />
            <Route path="/checkout-success" element={requireRole(['customer'], <CheckoutSuccess />)} />

            <Route path="/pharmacist/queue" element={requireRole(['pharmacist'], <PharmacistQueue />)} />
            <Route path="/pharmacist/review/:id" element={requireRole(['pharmacist'], <ClinicalReview />)} />

            <Route path="/admin/dashboard" element={requireRole(['admin'], <AdminDashboard />)} />
            <Route path="/admin/sales" element={requireRole(['admin'], <SalesReport />)} />
            <Route path="/inventory" element={requireRole(['admin', 'pharmacist'], <InventoryOverview />)} />
            <Route path="/add-medicine" element={requireRole(['admin', 'pharmacist'], <AddMedicine />)} />
            <Route path="/edit-medicine/:id" element={requireRole(['admin', 'pharmacist'], <EditMedicine />)} />
            <Route path="/medicine-success" element={requireRole(['admin', 'pharmacist'], <MedicineSuccess />)} />
            <Route path="/pharmacists" element={requireRole(['admin'], <ManagePharmacists />)} />
            <Route path="/add-pharmacist" element={requireRole(['admin'], <AddPharmacist />)} />
            <Route path="/edit-pharmacist/:id" element={requireRole(['admin'], <EditPharmacist />)} />
            <Route path="/pharmacist-success" element={requireRole(['admin'], <PharmacistSuccess />)} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {showGlobalNav && <BottomNav />}

        {!isLoggedIn && (
          <footer className="p-6 text-center text-xs text-on-surface font-semibold tracking-wide uppercase opacity-70 drop-shadow-sm dark:text-slate-400">
            Copyright 2024 Rediate Pharmacy Services. All Rights Reserved.
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
}
