import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiItemResponse, resolveAssetUrl } from '../lib/api';
import { Prescription } from '../types';

export default function ClinicalReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function fetchPrescription() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<Prescription>>(`/prescriptions/${id}`);
        setPrescription(response.data);
      } catch (err) {
        console.error('Failed to fetch prescription:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchPrescription();
  }, [id]);

  const handleAction = async (type: 'approved' | 'rejected') => {
    try {
      if (type === 'rejected' && !rejectionReason) {
        alert('Please select a rejection reason');
        return;
      }

      await api.patch(`/prescriptions/${id}/review`, {
        status: type,
        rejectionReason: type === 'rejected' ? rejectionReason : '',
        pharmacistNotes: notes,
      });

      setActionType(type);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/pharmacist/queue');
      }, 2500);
    } catch (err) {
      console.error('Failed to update prescription:', err);
      alert('Failed to update prescription. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center bg-[#F7F9FA] dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-on-surface-variant font-bold">Retrieving clinical records...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h3 className="text-xl font-bold">Prescription not found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 pb-32 bg-[#F7F9FA] dark:bg-slate-900 min-h-screen font-sans relative">
      {/* Notification Success Overlay */}
      {showNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${actionType === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <span className="material-symbols-outlined text-[40px] font-bold">
                {actionType === 'approved' ? 'check_circle' : 'cancel'}
              </span>
            </div>
            <h3 className="text-[22px] font-black text-[#111827] dark:text-white mb-2">
              {actionType === 'approved' ? 'Prescription Approved' : 'Prescription Rejected'}
            </h3>
            <p className="text-[14px] text-[#4B5563] dark:text-slate-400 font-medium leading-relaxed">
              The patient has been notified immediately via the Rediate Pharmacy app.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center text-[#004A8F] bg-white dark:bg-slate-800 shadow-sm"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-[20px] font-bold text-[#004A8F] dark:text-blue-400">
            Clinical Review
          </h1>
        </div>
        <div className="font-extrabold text-[#004A8F] dark:text-blue-400 text-[20px]">
          Rediate
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Document & Context */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Source Document */}
          <div className="bg-[#EAECEE] dark:bg-slate-800 rounded-[16px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[12px] font-bold text-[#4A545E] dark:text-slate-400 tracking-wider uppercase">
                Source Document:<br/><span className="text-[16px] text-[#111827] dark:text-white">{id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
                <button className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </button>
                <button className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </button>
              </div>
            </div>
            <div className="w-full bg-[#3482B9] rounded-[12px] overflow-hidden h-[400px] relative">
              {prescription.fileUrl ? (
                <img 
                  src={resolveAssetUrl(prescription.fileUrl)} 
                  alt="Prescription Scan" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                   <span className="material-symbols-outlined text-6xl mb-4">description</span>
                   <p className="font-bold">No digital copy available</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical Context */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="text-[11px] font-bold text-[#4A545E] dark:text-slate-400 uppercase tracking-widest mb-5">Medical Context</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F7F9FA] dark:bg-slate-900 p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] dark:text-slate-500 uppercase tracking-wider mb-1">Insurance Status</span>
                <span className="text-[15px] font-bold text-[#006644] dark:text-emerald-400">Pre-Authorized</span>
              </div>
              <div className="bg-[#F7F9FA] dark:bg-slate-900 p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] dark:text-slate-500 uppercase tracking-wider mb-1">Upload Date</span>
                <span className="text-[15px] font-bold text-[#111827] dark:text-white">{new Date(prescription.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="bg-[#F7F9FA] dark:bg-slate-900 p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] dark:text-slate-500 uppercase tracking-wider mb-1">Patient Email</span>
                <span className="text-[15px] font-bold text-[#111827] dark:text-white truncate block">{prescription.patientEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Patient Info */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-sm border-l-4 border-[#004A8F]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-[20px] font-bold text-[#111827] dark:text-white">{prescription.patientName}</h2>
              <span className="bg-[#EAECEE] dark:bg-slate-700 text-[#4A545E] dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shrink-0">
                PATIENT
              </span>
            </div>
            <div className="flex flex-wrap items-center text-[13px] text-[#4A545E] dark:text-slate-400 font-medium mb-6 gap-x-3 gap-y-2">
              <span>Doctor: <strong className="text-[#111827] dark:text-white">{prescription.doctorName}</strong></span>
            </div>

            {prescription.notes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[10px] p-4 flex gap-3 items-start border border-blue-100 dark:border-blue-900/50">
                <span className="material-symbols-outlined text-[#004A8F] text-[24px]">info</span>
                <div>
                  <p className="text-[10px] font-bold text-[#004A8F] uppercase tracking-wider mb-1">Patient Notes</p>
                  <p className="text-[13px] text-[#004A8F] dark:text-blue-300 italic">"{prescription.notes}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Review Decision */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-[18px] font-bold text-[#111827] dark:text-white mb-5">Review Decision</h3>
            
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-[#4A545E] dark:text-slate-400 uppercase tracking-widest mb-2">Rejection Reason</label>
              <div className="relative">
                <select 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-[#F7F9FA] dark:bg-slate-900 rounded-[10px] py-3.5 pl-4 pr-10 text-[14px] text-[#111827] dark:text-white font-medium appearance-none outline-none border border-gray-200 dark:border-slate-700 focus:border-[#004A8F] transition-colors"
                >
                  <option value="">Select a reason for rejection</option>
                  <option value="Allergy / Adverse Reaction">Allergy / Adverse Reaction</option>
                  <option value="Drug Interaction">Drug Interaction</option>
                  <option value="Incorrect Dosage">Incorrect Dosage</option>
                  <option value="Incomplete Information">Incomplete Information</option>
                  <option value="Illegible Script">Illegible Script</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#4A545E] pointer-events-none text-[22px]">expand_more</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-bold text-[#4A545E] dark:text-slate-400 uppercase tracking-widest mb-2">Pharmacist Notes</label>
              <textarea 
                rows={4} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter clinical observations or notes for the prescribing physician..."
                className="w-full bg-[#F7F9FA] dark:bg-slate-900 rounded-[10px] p-4 text-[14px] text-[#111827] dark:text-white outline-none border border-gray-200 dark:border-slate-700 focus:border-[#004A8F] transition-colors resize-none placeholder:text-[#9CA3AF]"
              ></textarea>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleAction('rejected')}
                className="w-full bg-[#C62828] text-white font-black py-4 rounded-[12px] text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-red-100 dark:shadow-none hover:bg-[#A02022] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span> Reject Prescription
              </button>
              <button 
                onClick={() => handleAction('approved')}
                className="w-full bg-[#006644] text-white font-black py-4 rounded-[12px] text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-none hover:bg-[#004A2F] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span> Approve Prescription
              </button>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="w-full mt-6 text-center text-[#004A8F] dark:text-blue-400 text-[14px] font-bold flex items-center justify-center gap-2 hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Return to Queue
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
