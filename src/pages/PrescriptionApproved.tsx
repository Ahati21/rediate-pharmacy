import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrescriptionApproved() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Prescription Status</h1>
        <button className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">more_vert</span>
        </button>
      </div>

      <div className="px-6 py-8">
        {/* Status Hero */}
        <div className="bg-[#E6F0ED] rounded-[32px] p-8 text-center mb-10 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
             <span className="material-symbols-outlined text-[100px]">verified</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#006644] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
             <span className="material-symbols-outlined text-[14px]">check_circle</span> Verification Success
          </div>
          <h2 className="text-[32px] font-black text-[#004A8F] leading-tight mb-3">Prescription Approved</h2>
          <p className="text-[14px] text-[#4B5563] font-medium max-w-[280px] mx-auto">
            Your medical order has been reviewed and validated by our clinical pharmacy team.
          </p>
        </div>

        {/* Medicines List */}
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[18px] font-black text-[#111827]">Approved Medicines</h3>
           <span className="bg-gray-100 text-[#6B7280] text-[10px] font-black px-3 py-1 rounded-full">3 Items</span>
        </div>

        <div className="space-y-4 mb-10">
           {[
             { name: "Amoxicillin 500mg", type: "Antibiotic • 15 Capsules", price: "240.00", badge: "VERIFIED DOSAGE", color: "#E6F4EA", textColor: "#006644", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200" },
             { name: "Ventolin Evohaler", type: "Bronchodilator • 1 Unit", price: "580.00", badge: "IN STOCK", color: "#EBF5FA", textColor: "#004A8F", img: "https://images.unsplash.com/photo-1603398938378-e54eab446f95?auto=format&fit=crop&q=80&w=200" },
             { name: "Paracetamol 500mg", type: "Analgesic • 20 Tablets", price: "45.50", badge: "ESSENTIAL", color: "#EBF5FA", textColor: "#004A8F", img: "https://images.unsplash.com/photo-1550572017-ed20027e9376?auto=format&fit=crop&q=80&w=200" }
           ].map((med, idx) => (
             <div key={idx} className="bg-white rounded-[24px] p-4 flex gap-4 shadow-sm border border-gray-50">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                   <img src={med.img} alt={med.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[15px] font-black text-[#111827]">{med.name}</h4>
                      <p className="text-[15px] font-black text-[#111827]">{med.price} <span className="text-[10px] text-[#6B7280]">ETB</span></p>
                   </div>
                   <p className="text-[12px] font-medium text-[#6B7280] mb-3">{med.type}</p>
                   <span style={{ backgroundColor: med.color, color: med.textColor }} className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                      {med.badge}
                   </span>
                </div>
             </div>
           ))}
        </div>

        {/* Cost Summary */}
        <div className="bg-[#F3F4F6]/50 rounded-[32px] p-8 border border-gray-100 mb-10">
           <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[14px] font-bold">
                 <span className="text-[#6B7280]">Subtotal</span>
                 <span className="text-[#111827]">865.50 ETB</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold">
                 <span className="text-[#6B7280]">Pharmacy Service Fee</span>
                 <span className="text-[#111827]">25.00 ETB</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold">
                 <span className="text-[#6B7280]">Delivery (Express)</span>
                 <span className="text-[#111827]">80.00 ETB</span>
              </div>
           </div>
           
           <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
              <div>
                 <p className="text-[11px] font-black text-[#004A8F] uppercase tracking-widest mb-1">Total Amount Due</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-[#111827]">970.50</span>
                    <span className="text-[14px] font-black text-[#6B7280]">ETB</span>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-1 text-[#006644] text-[9px] font-black uppercase tracking-tighter bg-[#E6F4EA] px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[12px]">security</span> Secure Checkout
                 </div>
              </div>
           </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/delivery')}
          className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[20px] shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] active:scale-[0.98] transition-all"
        >
          Confirm Delivery & Pay
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#004A8F] text-white px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">prescriptions</span>
          <span className="text-[10px] font-black uppercase">Prescriptions</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-bold uppercase">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}
