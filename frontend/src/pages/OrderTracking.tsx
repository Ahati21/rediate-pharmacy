import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../OrderContext';

export default function OrderTracking() {
  const navigate = useNavigate();
  const { orderDraft } = useOrder();

  const timeline = [
    { label: 'Order Confirmed', detail: 'Your order was received in the backend system.', complete: true },
    { label: 'Prescription Review', detail: 'Pharmacy review is queued or completed based on your upload.', complete: true },
    { label: 'Preparing Medication', detail: 'Medicines are being packed for dispatch.', complete: true },
    { label: 'Out for Delivery', detail: 'Courier dispatch begins once packaging is complete.', complete: false },
    { label: 'Delivered', detail: 'Expected shortly after dispatch.', complete: false },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      <div className="flex items-center justify-between px-6 py-6 bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Order Status</h1>
        <button className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>
      </div>

      <div className="bg-white px-6 py-8 border-b border-gray-100 flex justify-between items-center mb-6 shadow-sm">
        <div>
          <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Current Order</p>
          <h2 className="text-[24px] font-black text-[#004A8F]">{orderDraft?.orderNumber || 'Pending'}</h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Estimated Arrival</p>
          <div className="flex items-center gap-2 text-[#006644]">
            <span className="material-symbols-outlined text-[20px] font-bold">schedule</span>
            <span className="text-[20px] font-black">Within 2 hrs</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-[#F3F4F6]/50 rounded-[40px] p-10 border border-gray-100 relative">
          <p className="text-[11px] font-black text-[#004A8F]/40 uppercase tracking-[0.25em] mb-12">Tracking Timeline</p>

          <div className="relative space-y-12">
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
            {timeline.map((step, index) => (
              <div key={step.label} className="flex gap-8 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${step.complete ? 'bg-[#006644] text-white shadow-sm' : index === 3 ? 'bg-[#004A8F] text-white shadow-xl shadow-[#004A8F]/20' : 'bg-gray-200 text-[#9CA3AF]'}`}>
                  <span className="material-symbols-outlined text-[24px]">{step.complete ? 'check' : index === 3 ? 'local_shipping' : 'check_circle'}</span>
                </div>
                <div className={step.complete ? '' : index === 3 ? '' : 'opacity-40'}>
                  <h4 className="text-[16px] font-black text-[#111827]">{step.label}</h4>
                  <p className={`text-[13px] font-medium ${index === 3 ? 'text-[#004A8F]' : 'text-[#6B7280]'}`}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 mb-12">
          <h3 className="text-[20px] font-black text-[#111827] mb-8">Order Summary</h3>

          <div className="space-y-8 mb-10 pb-10 border-b border-gray-50">
            {orderDraft?.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex justify-between items-start">
                <div>
                  <h4 className="text-[16px] font-black text-[#111827]">{item.name}</h4>
                  <p className="text-[13px] font-medium text-[#6B7280]">Qty: {item.quantity} Unit(s)</p>
                </div>
                <p className="text-[16px] font-black text-[#111827]">{(item.unitPrice * item.quantity).toFixed(2)} ETB</p>
              </div>
            ))}
          </div>

          <div className="space-y-5 pt-4">
            <div className="flex justify-between text-[16px] font-bold">
              <span className="text-[#6B7280]">Subtotal</span>
              <span className="text-[#111827]">{orderDraft?.subtotal.toFixed(2) || '0.00'} ETB</span>
            </div>
            <div className="flex justify-between text-[16px] font-bold">
              <span className="text-[#6B7280]">Delivery Fee</span>
              <span className="text-[#111827]">{orderDraft?.deliveryFee.toFixed(2) || '0.00'} ETB</span>
            </div>
            <div className="pt-8 flex justify-between items-baseline border-t border-gray-100">
              <h3 className="text-[24px] font-black text-[#004A8F]">Total Amount</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] font-black text-[#004A8F]">{orderDraft?.totalAmount.toFixed(2) || '0.00'}</span>
                <span className="text-[16px] font-black text-[#004A8F]">ETB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
