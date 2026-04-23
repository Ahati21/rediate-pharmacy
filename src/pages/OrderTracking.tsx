import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderTracking() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Order Status</h1>
        <button className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>
      </div>

      {/* Top Info Bar */}
      <div className="bg-white px-6 py-8 border-b border-gray-100 flex justify-between items-center mb-6 shadow-sm">
        <div>
          <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Current Order</p>
          <h2 className="text-[24px] font-black text-[#004A8F]">#RD-88421</h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Estimated Arrival</p>
          <div className="flex items-center gap-2 text-[#006644]">
            <span className="material-symbols-outlined text-[20px] font-bold">schedule</span>
            <span className="text-[20px] font-black">4:30 PM</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Tracking Timeline */}
        <div className="bg-[#F3F4F6]/50 rounded-[40px] p-10 border border-gray-100 relative">
          <p className="text-[11px] font-black text-[#004A8F]/40 uppercase tracking-[0.25em] mb-12">Tracking Timeline</p>
          
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

            {/* Step 1 */}
            <div className="flex gap-8 relative z-10">
              <div className="w-12 h-12 bg-[#006644] rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm">
                <span className="material-symbols-outlined text-[24px]">check</span>
              </div>
              <div>
                <h4 className="text-[16px] font-black text-[#111827]">Order Confirmed</h4>
                <p className="text-[13px] font-medium text-[#6B7280]">Today, 10:15 AM</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 relative z-10">
              <div className="w-12 h-12 bg-[#006644] rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm">
                <span className="material-symbols-outlined text-[24px]">check</span>
              </div>
              <div>
                <h4 className="text-[16px] font-black text-[#111827]">Prescription Verified</h4>
                <p className="text-[13px] font-medium text-[#6B7280]">Today, 11:30 AM</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 relative z-10">
              <div className="w-12 h-12 bg-[#006644] rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm">
                <span className="material-symbols-outlined text-[24px]">check</span>
              </div>
              <div>
                <h4 className="text-[16px] font-black text-[#111827]">Preparing Medication</h4>
                <p className="text-[13px] font-medium text-[#6B7280]">Today, 1:45 PM</p>
              </div>
            </div>

            {/* Step 4 (Active) */}
            <div className="flex gap-8 relative z-10">
              <div className="w-12 h-12 bg-[#004A8F] rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl shadow-[#004A8F]/20">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <div>
                <h4 className="text-[16px] font-black text-[#111827]">Out for Delivery</h4>
                <p className="text-[13px] font-bold text-[#004A8F]">Your courier is 5 mins away</p>
              </div>
            </div>

            {/* Step 5 (Pending) */}
            <div className="flex gap-8 relative z-10">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-[#9CA3AF] border-4 border-white">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
              </div>
              <div className="opacity-40">
                <h4 className="text-[16px] font-black text-[#111827]">Delivered</h4>
                <p className="text-[13px] font-medium text-[#6B7280]">Expected shortly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Info */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black flex items-center justify-center border-4 border-gray-50 shadow-sm">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Courier" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
             <h4 className="text-[20px] font-black text-[#111827]">Kaleb T.</h4>
             <div className="flex items-center gap-2 text-[#006644] text-[11px] font-black uppercase tracking-widest mt-1">
                <span className="material-symbols-outlined text-[16px]">verified</span> Verified Courier
             </div>
          </div>
          <div className="flex gap-4">
             <button className="w-14 h-14 bg-[#EBF5FA] text-[#004A8F] rounded-[20px] flex items-center justify-center shadow-sm active:scale-90 transition-all hover:bg-[#D1E9F6]">
                <span className="material-symbols-outlined text-[24px]">call</span>
             </button>
             <button className="w-14 h-14 bg-[#EBF5FA] text-[#004A8F] rounded-[20px] flex items-center justify-center shadow-sm active:scale-90 transition-all hover:bg-[#D1E9F6]">
                <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
             </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 mb-12">
          <h3 className="text-[20px] font-black text-[#111827] mb-8">Order Summary</h3>
          
          <div className="space-y-8 mb-10 pb-10 border-b border-gray-50">
             <div className="flex justify-between items-start">
                <div>
                   <h4 className="text-[16px] font-black text-[#111827]">Amoxicillin 500mg</h4>
                   <p className="text-[13px] font-medium text-[#6B7280]">Qty: 1 Unit (Capsules)</p>
                </div>
                <p className="text-[16px] font-black text-[#111827]">420.00 ETB</p>
             </div>
             <div className="flex justify-between items-start">
                <div>
                   <h4 className="text-[16px] font-black text-[#111827]">Vitamin D3 1000 IU</h4>
                   <p className="text-[13px] font-medium text-[#6B7280]">Qty: 2 Units (Softgels)</p>
                </div>
                <p className="text-[16px] font-black text-[#111827]">215.00 ETB</p>
             </div>
          </div>

          <div className="space-y-5 pt-4">
             <div className="flex justify-between text-[16px] font-bold">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="text-[#111827]">635.00 ETB</span>
             </div>
             <div className="flex justify-between text-[16px] font-bold">
                <span className="text-[#6B7280]">Delivery Fee</span>
                <span className="text-[#111827]">45.00 ETB</span>
             </div>
             <div className="pt-8 flex justify-between items-baseline border-t border-gray-100">
                <h3 className="text-[24px] font-black text-[#004A8F]">Total Amount</h3>
                <div className="flex items-baseline gap-1">
                   <span className="text-[32px] font-black text-[#004A8F]">680.00</span>
                   <span className="text-[16px] font-black text-[#004A8F]">ETB</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button onClick={() => navigate('/search')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">medication</span>
          <span className="text-[10px] font-bold uppercase">Meds</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#F3F4F6] text-[#004A8F] px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="text-[10px] font-black uppercase">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}
