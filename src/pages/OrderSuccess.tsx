import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Rediate Pharmacy</h1>
        <div className="w-10 h-10"></div>
      </div>

      <div className="px-6 py-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-[#99FFCC] rounded-[24px] flex items-center justify-center text-[#006644] mb-8 shadow-lg shadow-green-100">
          <span className="material-symbols-outlined text-[48px] font-bold">check</span>
        </div>
        
        <h2 className="text-[40px] font-black text-[#111827] leading-tight mb-2">Order Successful!</h2>
        <p className="text-[15px] text-[#4B5563] font-medium max-w-[280px]">
          Thank you for choosing Rediate. Your medications are being prepared for delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-sm">
          <button 
            onClick={() => navigate('/tracking')}
            className="flex-1 bg-[#004A8F] text-white font-black py-5 rounded-[16px] flex items-center justify-center gap-3 shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Track Order Status
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-[#F3F4F6] text-[#4B5563] font-black py-5 rounded-[16px] hover:bg-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Order ID Bar */}
        <div className="bg-[#004A8F] rounded-[20px] p-6 text-white flex justify-between items-center shadow-lg">
           <div>
              <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Order ID</p>
              <h3 className="text-[24px] font-black">#RD-88421</h3>
           </div>
           <span className="material-symbols-outlined text-[40px] opacity-20">receipt</span>
        </div>

        {/* Delivery Bar */}
        <div className="bg-[#D1E9F6] rounded-[20px] p-6 text-[#004A8F] flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined">schedule</span>
           </div>
           <div>
              <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Estimated Delivery</p>
              <h3 className="text-[18px] font-black">Within 2 hours</h3>
           </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#F3F4F6]/50 rounded-[32px] p-8 border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[20px] font-black text-[#111827]">Order Summary</h3>
              <span className="bg-white text-[#6B7280] text-[10px] font-black px-3 py-1 rounded-full shadow-sm border border-gray-100">2 Items in package</span>
           </div>
           
           <div className="space-y-6 mb-10">
              <div className="bg-white rounded-[24px] p-5 flex gap-4 shadow-sm">
                 <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#004A8F]">
                    <span className="material-symbols-outlined text-[32px]">medication</span>
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[15px] font-black text-[#111827]">Amoxicillin</h4>
                       <p className="text-[15px] font-black text-[#111827]">120.00 <span className="text-[11px] text-[#6B7280]">ETB</span></p>
                    </div>
                    <p className="text-[11px] font-medium text-[#6B7280]">Antibiotic • 500mg • 20 Capsules</p>
                    <p className="text-[11px] font-black text-[#6B7280] mt-1">Qty: 01</p>
                 </div>
              </div>
              <div className="bg-white rounded-[24px] p-5 flex gap-4 shadow-sm">
                 <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#004A8F]">
                    <span className="material-symbols-outlined text-[32px]">water_drop</span>
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[15px] font-black text-[#111827]">Vitamin D3</h4>
                       <p className="text-[15px] font-black text-[#111827]">85.00 <span className="text-[11px] text-[#6B7280]">ETB</span></p>
                    </div>
                    <p className="text-[11px] font-medium text-[#6B7280]">Supplement • 2000 IU • 30 Tablets</p>
                    <p className="text-[11px] font-black text-[#6B7280] mt-1">Qty: 01</p>
                 </div>
              </div>
           </div>

           <div className="space-y-6 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-3 text-[#111827]">
                 <span className="material-symbols-outlined text-[20px] text-[#004A8F]">location_on</span>
                 <div>
                    <p className="text-[11px] font-black text-[#004A8F] uppercase tracking-widest mb-1">Delivery Address</p>
                    <p className="text-[14px] font-bold leading-relaxed">
                       Bole, Woreda 03, House #452, Addis Ababa, Ethiopia
                    </p>
                 </div>
              </div>

              <div className="flex justify-between items-end pt-4">
                 <p className="text-[12px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Grand Total</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-[36px] font-black text-[#004A8F]">205.00</span>
                    <span className="text-[16px] font-black text-[#004A8F]">ETB</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Trust Alert */}
        <div className="bg-[#006644] rounded-[24px] p-6 text-white flex gap-4 shadow-lg shadow-green-100/50">
           <span className="material-symbols-outlined text-[24px]">verified</span>
           <div className="flex-1">
              <p className="text-[12px] font-medium leading-relaxed mb-3">
                 Our pharmacists are reviewing your prescription for accuracy and safety.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
                 Need help with this order?
              </button>
           </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#F3F4F6] text-[#004A8F] px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-black uppercase">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">medical_services</span>
          <span className="text-[10px] font-bold uppercase">Pharmacy</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Account</span>
        </button>
      </div>
    </div>
  );
}
