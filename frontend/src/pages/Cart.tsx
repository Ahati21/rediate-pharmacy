import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../OrderContext';

export default function Cart() {
  const navigate = useNavigate();
  const { orderDraft, setOrderDraft } = useOrder();

  const items = orderDraft?.items ?? [];

  const updateQuantity = (index: number, delta: number) => {
    if (!orderDraft) return;

    const nextItems = orderDraft.items
      .map((item, itemIndex) => (
        itemIndex === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ));

    const subtotal = Number(nextItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2));
    const tax = Number((subtotal * 0.05).toFixed(2));

    setOrderDraft({
      ...orderDraft,
      items: nextItems,
      subtotal,
      tax,
      totalAmount: Number((subtotal + tax + (orderDraft.deliveryFee || 0)).toFixed(2)),
    });
  };

  if (!orderDraft || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-black text-[#111827] mb-4">Your cart is empty</h1>
        <p className="text-[#6B7280] mb-8">Add a medicine from the live catalog to begin checkout.</p>
        <button onClick={() => navigate('/search')} className="rounded-xl bg-[#004A8F] px-6 py-4 font-bold text-white">
          Browse Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32 bg-[#F8FAFB] min-h-screen font-sans">
      <div className="flex items-center justify-between mb-8 px-2 mt-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#111827]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-extrabold text-[#111827] flex-1 text-center">Rediate Pharmacy</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-2 mb-8">
        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">Current Order</p>
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] font-black text-[#111827]">Your Cart ({items.length})</h2>
          <button onClick={() => setOrderDraft(null)} className="flex items-center gap-1.5 text-[#C62828] text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Clear Cart
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {items.map((item, index) => {
          const totalPrice = item.unitPrice * item.quantity;

          return (
            <div key={`${item.name}-${index}`} className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex gap-4">
              <div className="w-24 h-24 bg-[#F3F4F6] rounded-[18px] overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                <span className="material-symbols-outlined text-[#004A8F] text-[40px]">medication</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[15px] font-black text-[#111827] leading-tight">{item.name}</h3>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-[#111827]">{totalPrice.toFixed(2)}</p>
                    <p className="text-[11px] font-black text-[#111827]">ETB</p>
                  </div>
                </div>
                <p className="text-[12px] font-medium text-[#6B7280] mb-2">Prepared from the live pharmacy catalog</p>

                <div className="mb-4">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#E6F4EA] text-[#006644]">
                    Ready for Checkout
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-[#F3F4F6] px-3 py-1.5 rounded-full">
                    <button className="text-[#111827] font-bold text-lg" onClick={() => updateQuantity(index, -1)}>
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="text-[14px] font-black text-[#111827] w-4 text-center">{item.quantity.toString().padStart(2, '0')}</span>
                    <button className="text-[#111827] font-bold text-lg" onClick={() => updateQuantity(index, 1)}>
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-tighter">
                    {item.unitPrice.toFixed(2)} ETB EA
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-50 mb-12">
        <h3 className="text-[20px] font-black text-[#111827] mb-6">Order Summary</h3>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-[14px] font-bold">
            <span className="text-[#6B7280]">Subtotal</span>
            <span className="text-[#111827]">{orderDraft.subtotal.toFixed(2)} ETB</span>
          </div>
          <div className="flex justify-between items-center text-[14px] font-bold">
            <span className="text-[#6B7280]">Shipping</span>
            <span className="text-[#006644] uppercase tracking-widest text-[11px]">{orderDraft.deliveryFee ? `${orderDraft.deliveryFee.toFixed(2)} ETB` : 'Free'}</span>
          </div>
          <div className="flex justify-between items-center text-[14px] font-bold">
            <span className="text-[#6B7280]">Estimated Tax</span>
            <span className="text-[#111827]">{orderDraft.tax.toFixed(2)} ETB</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 mb-8">
          <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">Total Amount</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-black text-[#004A8F]">{orderDraft.totalAmount.toFixed(2)}</span>
            <span className="text-[18px] font-black text-[#004A8F]">ETB</span>
          </div>
        </div>

        <button onClick={() => navigate('/delivery')} className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] transition-all mb-6">
          Proceed to Checkout
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <div className="flex items-center justify-center gap-3 px-4 py-4 bg-[#F8FAFB] rounded-[16px]">
          <span className="material-symbols-outlined text-[#004A8F] text-[20px]">verified_user</span>
          <p className="text-[10px] font-medium text-[#4B5563] leading-tight">
            Your medical data and transaction are secured with 256-bit encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
