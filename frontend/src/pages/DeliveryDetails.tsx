import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useOrder } from '../OrderContext';

export default function DeliveryDetails() {
  const navigate = useNavigate();
  const { user, userName } = useAuth();
  const { orderDraft, setOrderDraft } = useOrder();
  
  const [fullName, setFullName] = useState(userName || user?.name || '');
  const [phone, setPhone] = useState('');
  const [woreda, setWoreda] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [landmarks, setLandmarks] = useState('');

  const handleContinue = () => {
    if (!orderDraft) return;

    const fullAddress = `Woreda ${woreda}, House No. ${houseNo}${landmarks ? `, Near ${landmarks}` : ''}, Addis Ababa`;
    
    setOrderDraft({
      ...orderDraft,
      deliveryAddress: fullAddress,
      deliveryFee: 85, // Standard delivery fee
      totalAmount: Number((orderDraft.subtotal + (orderDraft.tax || 0) + 85).toFixed(2))
    });
    
    navigate('/checkout');
  };

  if (!orderDraft) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-black text-[#111827] mb-4">Nothing to deliver</h1>
        <button onClick={() => navigate('/search')} className="rounded-xl bg-[#004A8F] px-6 py-4 font-bold text-white">
          Browse Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Order Details</h1>
        <h2 className="text-[14px] font-black text-[#004A8F]">REDIATE</h2>
      </div>

      <div className="px-6 py-6">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 bg-[#006644] rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">check</span>
             </div>
             <span className="text-[9px] font-black text-[#006644] uppercase tracking-tighter">Items</span>
          </div>
          <div className="flex-1 h-[2px] bg-[#004A8F] mx-2 mb-6"></div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 bg-[#004A8F] rounded-full flex items-center justify-center text-white ring-4 ring-[#EBF5FA]">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
             </div>
             <span className="text-[9px] font-black text-[#004A8F] uppercase tracking-tighter">Delivery</span>
          </div>
          <div className="flex-1 h-[2px] bg-gray-200 mx-2 mb-6"></div>
          <div className="flex flex-col items-center gap-2 opacity-30">
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined text-[20px]">payments</span>
             </div>
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Payment</span>
          </div>
        </div>

        {/* Approval Notice Card */}
        {orderDraft.items.some(i => i.name.toLowerCase().includes('prescription')) && (
          <div className="bg-[#E6F0ED] rounded-[24px] p-5 flex items-start gap-4 mb-8 border border-green-100">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#006644] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">verified</span>
             </div>
             <div className="flex-1">
                <h4 className="text-[14px] font-black text-[#006644] mb-1">Prescription Items Included</h4>
                <p className="text-[11px] text-[#4B5563] font-medium leading-relaxed">
                   Your clinical items have been verified and added to this delivery batch.
                </p>
             </div>
          </div>
        )}

        {/* Recipient Information */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 mb-6">
           <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#004A8F] text-[20px]">person_pin_circle</span>
              <h3 className="text-[18px] font-black text-[#111827]">Recipient Information</h3>
           </div>
           
           <div className="space-y-6">
              <div>
                 <label className="text-[11px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Full Name</label>
                 <input 
                   type="text" 
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   placeholder="e.g. Abebe Bikila"
                   className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all"
                 />
              </div>
              <div>
                 <label className="text-[11px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                 <div className="flex gap-2">
                    <div className="bg-[#F3F4F6] px-4 py-4 rounded-[16px] text-[14px] font-black text-[#004A8F]">+251</div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="911 223344"
                      className="flex-1 bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 mb-10">
           <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#004A8F] text-[20px]">location_on</span>
              <h3 className="text-[18px] font-black text-[#111827]">Delivery Address</h3>
           </div>
           
           <div className="space-y-6">
              <div>
                 <label className="text-[11px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Woreda</label>
                 <input 
                   type="text" 
                   value={woreda}
                   onChange={(e) => setWoreda(e.target.value)}
                   placeholder="01"
                   className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all"
                 />
              </div>
              <div>
                 <label className="text-[11px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">House Number</label>
                 <input 
                   type="text" 
                   value={houseNo}
                   onChange={(e) => setHouseNo(e.target.value)}
                   placeholder="New / 450 / B-12"
                   className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all"
                 />
              </div>
              <div>
                 <label className="text-[11px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Specific Landmarks or Directions</label>
                 <textarea 
                   rows={3}
                   value={landmarks}
                   onChange={(e) => setLandmarks(e.target.value)}
                   placeholder="Near Edna Mall, the building behind the pharmacy..."
                   className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all resize-none"
                 />
              </div>
           </div>
        </div>

        {/* Sticky Total & Button */}
        <div className="bg-[#F3F4F6]/80 backdrop-blur-md rounded-[32px] p-6 border border-gray-100 shadow-lg">
           <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-[14px] font-black text-[#6B7280] uppercase tracking-widest">Order Subtotal</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-[24px] font-black text-[#004A8F]">{orderDraft.totalAmount.toFixed(2)}</span>
                 <span className="text-[14px] font-black text-[#004A8F]">ETB</span>
              </div>
           </div>
           
           <button 
             onClick={handleContinue}
             className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] active:scale-[0.98] transition-all"
           >
              Continue to Payment
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
           </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-bold uppercase">Shop</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#F3F4F6] text-[#004A8F] px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-black uppercase">Orders</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-bold uppercase">Cart</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Account</span>
        </button>
      </div>
    </div>
  );
}
