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
import MedicineSuccess from './pages/MedicineSuccess';
import ManagePharmacists from './pages/ManagePharmacists';
import AddPharmacist from './pages/AddPharmacist';
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
import { useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  const isCheckoutFunnel = ['/cart', '/delivery', '/checkout', '/success', '/tracking', '/prescription-approved', '/upload-script'].includes(location.pathname);
  const showGlobalNav = isLoggedIn && !isCheckoutFunnel;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-body bg-background text-on-background dark:bg-[#0F172A] dark:text-slate-200">
        {showGlobalNav && <Header />}
        
        <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
          
          {/* Customer Routes */}
          <Route path="/" element={isLoggedIn ? (role === 'customer' ? <CustomerHome /> : role === 'pharmacist' ? <PharmacistQueue /> : <AdminDashboard />) : <Navigate to="/login" />} />
          <Route path="/search" element={isLoggedIn ? <MedicationSearch /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/delivery" element={isLoggedIn ? <DeliveryDetails /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/upload-script" element={isLoggedIn ? <ScriptUpload /> : <Navigate to="/login" />} />
          <Route path="/prescription-approved" element={isLoggedIn ? <PrescriptionApproved /> : <Navigate to="/login" />} />
          <Route path="/success" element={isLoggedIn ? <OrderSuccess /> : <Navigate to="/login" />} />
          <Route path="/tracking" element={isLoggedIn ? <OrderTracking /> : <Navigate to="/login" />} />
          
          {/* Pharmacist Routes */}
          <Route path="/pharmacist/queue" element={isLoggedIn ? <PharmacistQueue /> : <Navigate to="/login" />} />
          <Route path="/pharmacist/review" element={isLoggedIn ? <ClinicalReview /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/sales" element={isLoggedIn ? <SalesReport /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={isLoggedIn ? <InventoryOverview /> : <Navigate to="/login" />} />
          <Route path="/add-medicine" element={isLoggedIn ? <AddMedicine /> : <Navigate to="/login" />} />
          <Route path="/medicine-success" element={isLoggedIn ? <MedicineSuccess /> : <Navigate to="/login" />} />
          <Route path="/pharmacists" element={isLoggedIn ? <ManagePharmacists /> : <Navigate to="/login" />} />
          <Route path="/add-pharmacist" element={isLoggedIn ? <AddPharmacist /> : <Navigate to="/login" />} />
          <Route path="/pharmacist-success" element={isLoggedIn ? <PharmacistSuccess /> : <Navigate to="/login" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {showGlobalNav && <BottomNav />}
      
      {!isLoggedIn && (
         <footer className="p-6 text-center text-xs text-on-surface font-semibold tracking-wide uppercase opacity-70 drop-shadow-sm dark:text-slate-400">
            © 2024 Rediate Pharmacy Services. All Rights Reserved.
         </footer>
      )}
      </div>
    </ThemeProvider>
  );
}
