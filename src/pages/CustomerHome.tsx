import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-32 bg-[#F7F9FA] dark:bg-slate-900 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <p className="text-[#6B7280] dark:text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase mb-2">Personalized Health Care</p>
          <h1 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-[1.1] max-w-[300px] mb-6">
            How would you like to get your medication today?
          </h1>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search medicines, health prod..."
              className="w-full bg-[#F2F4F5] dark:bg-slate-800 rounded-[12px] py-4 pl-12 pr-4 text-[14px] text-[#111827] dark:text-white outline-none border-none placeholder-[#9CA3AF] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Prescription Approved Alert */}
      <div className="bg-[#EAF3EE] dark:bg-emerald-900/20 border border-[#CDE5D8] dark:border-emerald-900/50 rounded-[24px] p-6 flex flex-col items-center text-center mb-8 shadow-sm">
        <div className="w-10 h-10 bg-[#006644] rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
          <span className="material-symbols-outlined text-[20px] font-bold">check_circle</span>
        </div>
        <p className="text-[13px] text-[#111827] dark:text-emerald-400 font-medium leading-relaxed mb-6">
          Your prescription has been <span className="font-bold">approved</span> by the pharmacist! Review details and complete your checkout to begin delivery.
        </p>
        <button 
          onClick={() => navigate('/checkout')}
          className="bg-[#006644] text-white font-bold py-3 px-8 rounded-full text-[13px] shadow-[0_4px_14px_rgba(0,102,68,0.25)] hover:bg-[#004d33] transition-colors"
        >
          Proceed to Payment
        </button>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Search & Buy Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-700 flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-[#004A8F] rounded-xl flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            </div>
            <span className="bg-[#F2F4F5] dark:bg-slate-900 text-[#4A545E] dark:text-slate-400 text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">Fastest</span>
          </div>
          
          <h2 className="text-[20px] font-extrabold text-[#111827] dark:text-white mb-3">Search & Buy Directly</h2>
          <p className="text-[#6B7280] dark:text-slate-400 text-[13px] leading-relaxed mb-6 flex-1">
            Browse our full clinical catalog of over-the-counter medicines, vitamins, and health essentials. Add to cart and pay securely.
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006644] dark:text-emerald-400 text-[16px] font-bold">check_circle</span>
              <span className="text-[#4A545E] dark:text-slate-300 text-[12px] font-medium">Instant browsing & checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006644] dark:text-emerald-400 text-[16px] font-bold">check_circle</span>
              <span className="text-[#4A545E] dark:text-slate-300 text-[12px] font-medium">Daily wellness essentials</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/search')}
            className="w-full bg-[#004A8F] text-white font-bold py-3.5 rounded-[12px] text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#004A8F]/20 hover:bg-[#003870] transition-colors"
          >
            Browse Catalog <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Upload Prescription Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-700 flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-[#006644] rounded-xl flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">upload</span>
            </div>
            <span className="bg-[#A7F3D0] dark:bg-emerald-900/30 text-[#065F46] dark:text-emerald-400 text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">Clinical</span>
          </div>
          
          <h2 className="text-[20px] font-extrabold text-[#111827] dark:text-white mb-3">Upload Prescription</h2>
          <p className="text-[#6B7280] dark:text-slate-400 text-[13px] leading-relaxed mb-6 flex-1">
            Snap a photo of your doctor's prescription. Our certified pharmacists will review, approve, and prepare your medication.
          </p>
          
          <div className="flex gap-2 mb-8">
            <div className="flex-1 bg-[#F2F4F5] dark:bg-slate-900 rounded-[10px] py-3 flex flex-col items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[16px]">photo_camera</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#111827] dark:text-white">Snap</span>
            </div>
            <div className="flex-1 bg-[#F2F4F5] dark:bg-slate-900 rounded-[10px] py-3 flex flex-col items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[16px]">verified_user</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#111827] dark:text-white">Review</span>
            </div>
            <div className="flex-1 bg-[#F2F4F5] dark:bg-slate-900 rounded-[10px] py-3 flex flex-col items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[16px]">credit_card</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#111827] dark:text-white">Pay</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/upload-script')}
            className="w-full bg-[#003B28] text-white font-bold py-3.5 rounded-[12px] text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#003B28]/30 hover:bg-black transition-colors"
          >
            Snap & Upload <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
          </button>
        </div>

      </div>

      {/* Health Categories */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-extrabold text-[#111827] dark:text-white">Health Categories</h3>
            <p className="text-[#6B7280] dark:text-slate-400 text-[12px] mt-0.5">Curated medical supplies and medicine</p>
          </div>
          <button className="text-[#004A8F] dark:text-blue-400 text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 hover:underline">
            View All Categories <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
          <div className="min-w-[110px] bg-white dark:bg-slate-800 rounded-[16px] p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[28px] mb-3">medication</span>
            <span className="text-[11px] font-bold text-[#111827] dark:text-white">Pain Relief</span>
          </div>
          <div className="min-w-[110px] bg-white dark:bg-slate-800 rounded-[16px] p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[28px] mb-3">monitor_heart</span>
            <span className="text-[11px] font-bold text-[#111827] dark:text-white">Diabetes</span>
          </div>
          <div className="min-w-[110px] bg-white dark:bg-slate-800 rounded-[16px] p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[28px] mb-3">clean_hands</span>
            <span className="text-[11px] font-bold text-[#111827] dark:text-white">Hygiene</span>
          </div>
          <div className="min-w-[110px] bg-white dark:bg-slate-800 rounded-[16px] p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[28px] mb-3">child_care</span>
            <span className="text-[11px] font-bold text-[#111827] dark:text-white">Baby Care</span>
          </div>
        </div>
      </div>

      {/* Your Recent Prescriptions */}
      <div className="bg-[#F2F4F5] dark:bg-slate-800/50 rounded-[32px] p-8 relative overflow-hidden">
        <span className="material-symbols-outlined text-[200px] text-gray-200/50 dark:text-slate-800/50 absolute -right-12 -top-12 pointer-events-none">history</span>
        
        <div className="relative z-10">
          <h3 className="text-[24px] font-extrabold text-[#111827] dark:text-white mb-2 leading-tight">Your Recent<br/>Prescriptions</h3>
          <p className="text-[#6B7280] dark:text-slate-400 text-[13px] leading-relaxed max-w-[240px] mb-8">
            Quickly reorder your recurring medications or track the status of your latest doctor uploads.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-white/60 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-12 bg-[#E9F2ED] dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-[#006644] dark:text-emerald-400">
                <span className="material-symbols-outlined text-[20px]">prescriptions</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#111827] dark:text-white mb-0.5">Amoxicillin<br/>500mg</p>
                <p className="text-[10px] text-[#6B7280] dark:text-slate-400">Order #RD-6821 • Delivered Nov 12</p>
              </div>
            </div>
            <button className="text-[#004A8F] dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline px-2">
              Reorder
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
