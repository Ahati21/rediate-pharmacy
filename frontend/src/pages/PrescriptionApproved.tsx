import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../OrderContext';
import { api, ApiListResponse } from '../lib/api';
import { Prescription } from '../types';

export default function PrescriptionApproved() {
  const navigate = useNavigate();
  const { prescriptionDraft, orderDraft, setOrderDraft } = useOrder();
  const [latestPrescription, setLatestPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiListResponse<Prescription>>('/prescriptions');
        if (response.data.length > 0) {
          setLatestPrescription(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch latest prescription:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const displayPresc = latestPrescription || (prescriptionDraft ? { 
    ...prescriptionDraft, 
    status: 'pending', 
    createdAt: new Date().toISOString() 
  } as any : null);

  const estimatedSubtotal = orderDraft?.subtotal ?? 0;
  const estimatedTotal = orderDraft?.totalAmount ?? 0;

  if (isLoading && !displayPresc) {
    return (
      <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen flex items-center justify-center font-sans">
        <p className="text-[#6B7280] font-bold animate-pulse">Loading status...</p>
      </div>
    );
  }

  const isApproved = displayPresc?.status === 'approved';

  const handleProceed = () => {
    if (isApproved && !orderDraft) {
      // Create a draft if it doesn't exist
      setOrderDraft({
        items: [{
          name: `Prescription: ${displayPresc.fileName || 'Clinical Items'}`,
          quantity: 1,
          unitPrice: 450.00 // Example price
        }],
        subtotal: 450.00,
        tax: 22.50,
        deliveryFee: 85.00,
        totalAmount: 557.50
      });
    }
    navigate('/delivery');
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center text-[#004A8F]">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Prescription Status</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-8">
        <div className={`${isApproved ? 'bg-[#EAF3EE] border-[#CDE5D8]' : 'bg-[#EBF5FA] border-[#D1E9F6]'} border rounded-[32px] p-8 text-center mb-10 relative overflow-hidden shadow-sm`}>
          <div className="absolute top-4 right-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]">{isApproved ? 'verified' : 'history'}</span>
          </div>
          <div className={`inline-flex items-center gap-2 ${isApproved ? 'bg-[#006644]' : 'bg-[#004A8F]'} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm`}>
            <span className="material-symbols-outlined text-[14px]">{isApproved ? 'check_circle' : 'pending'}</span>
            {isApproved ? 'Clinical Approval Granted' : 'Pending Pharmacist Review'}
          </div>
          <h2 className={`text-[32px] font-black ${isApproved ? 'text-[#006644]' : 'text-[#004A8F]'} leading-tight mb-3`}>
            {isApproved ? 'Prescription Approved' : 'Submission Received'}
          </h2>
          <p className="text-[14px] text-[#4B5563] font-medium max-w-[320px] mx-auto">
            {isApproved 
              ? `Your prescription from ${displayPresc?.doctorName} has been verified. You can now complete your delivery details.`
              : `Your prescription from ${displayPresc?.doctorName || 'your doctor'} is in the clinical queue.`}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-black text-[#111827]">Submission Details</h3>
          <span className={`${isApproved ? 'bg-[#E6F4EA] text-[#006644]' : 'bg-gray-100 text-[#6B7280]'} text-[10px] font-black px-3 py-1 rounded-full uppercase`}>
            {displayPresc?.status || 'Pending'}
          </span>
        </div>

        <div className="space-y-4 mb-10">
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Doctor Name</p>
            <p className="text-[16px] font-black text-[#111827]">{displayPresc?.doctorName || 'Not provided'}</p>
          </div>
          {displayPresc?.pharmacistNotes && (
             <div className="bg-[#FFF9E6] rounded-[24px] p-5 shadow-sm border border-[#FFE082]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#856404] mb-2">Pharmacist Notes</p>
                <p className="text-[14px] font-medium text-[#856404] italic">"{displayPresc.pharmacistNotes}"</p>
             </div>
          )}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Notes</p>
            <p className="text-[14px] font-medium text-[#4B5563]">{displayPresc?.notes || 'No extra notes were added.'}</p>
          </div>
          {displayPresc?.fileName && (
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Uploaded File</p>
              <p className="text-[14px] font-black text-[#004A8F]">{displayPresc.fileName}</p>
            </div>
          )}
        </div>

        {isApproved && (
          <div className="bg-[#F3F4F6]/50 rounded-[32px] p-8 border border-gray-100 mb-10">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[14px] font-bold">
                <span className="text-[#6B7280]">Estimated Subtotal</span>
                <span className="text-[#111827]">{estimatedSubtotal.toFixed(2) || '450.00'} ETB</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold">
                <span className="text-[#6B7280]">Estimated Tax</span>
                <span className="text-[#111827]">{(orderDraft?.tax ?? 22.50).toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold">
                <span className="text-[#6B7280]">Delivery</span>
                <span className="text-[#111827]">{(orderDraft?.deliveryFee ?? 85.00).toFixed(2)} ETB</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
              <div>
                <p className="text-[11px] font-black text-[#004A8F] uppercase tracking-widest mb-1">Estimated Total</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] font-black text-[#111827]">{estimatedTotal.toFixed(2) || '557.50'}</span>
                  <span className="text-[14px] font-black text-[#6B7280]">ETB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleProceed}
          className={`w-full ${isApproved ? 'bg-[#004A8F]' : 'bg-gray-400 cursor-not-allowed'} text-white font-black py-5 rounded-[20px] shadow-xl shadow-[#004A8F]/20 hover:scale-[0.98] transition-all`}
          disabled={!isApproved}
        >
          {isApproved ? 'Review & Checkout' : 'Waiting for Approval'}
        </button>
      </div>
    </div>
  );
}
