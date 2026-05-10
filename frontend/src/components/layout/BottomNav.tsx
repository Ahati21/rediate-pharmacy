import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function BottomNav() {
  const { role } = useAuth();

  if (role === 'pharmacist') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <NavLink to="/pharmacist/queue" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#EBF5FA] dark:bg-blue-900/30 text-[#004A8F] dark:text-blue-400 rounded-[10px] px-6 py-2' : 'text-[#9CA3AF] dark:text-slate-500'}`}>
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Review</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#EBF5FA] dark:bg-blue-900/30 text-[#004A8F] dark:text-blue-400 rounded-[10px] px-6 py-2' : 'text-[#9CA3AF] dark:text-slate-500'}`}>
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Stock</span>
        </NavLink>
        <NavLink to="/pharmacist/pay" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#EBF5FA] dark:bg-blue-900/30 text-[#004A8F] dark:text-blue-400 rounded-[10px] px-6 py-2' : 'text-[#9CA3AF] dark:text-slate-500'}`}>
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Pay</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#004A8F] dark:bg-blue-600 text-white rounded-[12px] px-4 py-1.5' : 'text-[#6B7280] dark:text-slate-400'}`}>
        <span className="material-symbols-outlined text-[20px]">home</span>
        <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Home</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#004A8F] dark:bg-blue-600 text-white rounded-[12px] px-4 py-1.5' : 'text-[#6B7280] dark:text-slate-400'}`}>
        <span className="material-symbols-outlined text-[20px]">search</span>
        <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Search</span>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#004A8F] dark:bg-blue-600 text-white rounded-[12px] px-4 py-1.5' : 'text-[#6B7280] dark:text-slate-400'}`}>
        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
        <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Cart</span>
      </NavLink>
      <NavLink to="/login" className={({ isActive }) => `flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[#004A8F] dark:bg-blue-600 text-white rounded-[12px] px-4 py-1.5' : 'text-[#6B7280] dark:text-slate-400'}`}>
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Account</span>
      </NavLink>
    </nav>
  );
}
