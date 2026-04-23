import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClinicalReview() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = React.useState(false);
  const [actionType, setActionType] = React.useState<'approved' | 'rejected' | null>(null);

  const handleAction = (type: 'approved' | 'rejected') => {
    setActionType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      navigate('/pharmacist/queue');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 pb-32 bg-[#F7F9FA] min-h-screen font-sans relative">
      {/* Notification Success Overlay */}
      {showNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${actionType === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <span className="material-symbols-outlined text-[40px] font-bold">
                {actionType === 'approved' ? 'check_circle' : 'cancel'}
              </span>
            </div>
            <h3 className="text-[22px] font-black text-[#111827] mb-2">
              {actionType === 'approved' ? 'Prescription Approved' : 'Prescription Rejected'}
            </h3>
            <p className="text-[14px] text-[#4B5563] font-medium leading-relaxed">
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
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center text-[#004A8F] bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-[20px] font-bold text-[#004A8F]">
            Clinical Review
          </h1>
        </div>
        <div className="font-extrabold text-[#004A8F] text-[20px]">
          Rediate
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Document & Context */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Source Document */}
          <div className="bg-[#EAECEE] rounded-[16px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[12px] font-bold text-[#4A545E] tracking-wider uppercase">
                Source Document:<br/><span className="text-[16px] text-[#111827]">PRX-8829-01</span>
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#004A8F] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </button>
              </div>
            </div>
            <div className="w-full bg-blue-500 rounded-[12px] overflow-hidden h-[400px] relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173ff9e5eb2?auto=format&fit=crop&q=80&w=1200" 
                alt="Prescription Scan" 
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="absolute inset-0 bg-[#3482B9] opacity-20"></div>
            </div>
          </div>

          {/* Medical Context */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100">
            <h4 className="text-[11px] font-bold text-[#4A545E] uppercase tracking-widest mb-5">Medical Context</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F7F9FA] p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] uppercase tracking-wider mb-1">Insurance Status</span>
                <span className="text-[15px] font-bold text-[#006644]">Pre-Authorized</span>
              </div>
              <div className="bg-[#F7F9FA] p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] uppercase tracking-wider mb-1">Last Fill Date</span>
                <span className="text-[15px] font-bold text-[#111827]">Mar 12, 2024</span>
              </div>
              <div className="bg-[#F7F9FA] p-4 rounded-[12px]">
                <span className="block text-[11px] text-[#6B7280] uppercase tracking-wider mb-1">Payer Group</span>
                <span className="text-[15px] font-bold text-[#111827]">Premium Blue Health</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Patient Info */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border-l-4 border-[#C62828]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-[20px] font-bold text-[#111827]">Abebe Bikila</h2>
              <span className="bg-[#EAECEE] text-[#4A545E] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shrink-0">
                ID: #44021
              </span>
            </div>
            <div className="flex flex-wrap items-center text-[13px] text-[#4A545E] font-medium mb-6 gap-x-3 gap-y-2">
              <span>34 Years Old</span>
              <span className="text-gray-300">•</span>
              <span>Male</span>
              <span className="text-gray-300">•</span>
              <span>78kg</span>
              <span className="text-gray-300">•</span>
              <span className="text-[#004A8F] font-bold">Type: O+</span>
            </div>

            <div className="bg-[#FDECEC] rounded-[10px] p-4 flex gap-3 items-start border border-[#F5C2C7]">
              <span className="material-symbols-outlined text-[#C62828] text-[24px]">warning</span>
              <div>
                <p className="text-[10px] font-bold text-[#C62828] uppercase tracking-wider mb-1">Clinical Alert</p>
                <p className="text-[15px] font-bold text-[#C62828]">Penicillin Allergy</p>
              </div>
            </div>
          </div>

          {/* Prescribed Medication */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#006644] uppercase tracking-widest mb-2">Prescribed Medication</p>
                <h3 className="text-[24px] font-bold text-[#111827] leading-tight mb-2">Amoxicillin<br/>500mg</h3>
                <p className="text-[14px] text-[#4A545E]">Capsule • Oral<br/>Three times daily for 7 days</p>
              </div>
              <div className="text-right bg-[#F7F9FA] p-3 rounded-[12px]">
                <p className="text-[10px] font-bold text-[#4A545E] uppercase tracking-widest mb-1">Total Quantity</p>
                <p className="text-[28px] font-bold text-[#111827] leading-none mb-1">21</p>
                <p className="text-[13px] font-medium text-[#4A545E] uppercase tracking-widest">Units</p>
              </div>
            </div>

            <div className="bg-[#FDECEC] rounded-[12px] p-5 flex gap-4 items-start border-l-4 border-[#C62828]">
              <div className="w-8 h-8 rounded-full bg-[#C62828] flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-white text-[20px]">priority_high</span>
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#C62828] mb-2 leading-tight">Critical Interaction Detected</p>
                <p className="text-[13px] text-[#C62828] leading-relaxed">
                  Patient has a documented <strong className="underline decoration-[#C62828] underline-offset-2 font-bold">severe allergy to Penicillin.</strong> Amoxicillin is a penicillin-based antibiotic and may cause anaphylactic shock.
                </p>
              </div>
            </div>
          </div>

          {/* Review Decision */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100">
            <h3 className="text-[18px] font-bold text-[#111827] mb-5">Review Decision</h3>
            
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-[#4A545E] uppercase tracking-widest mb-2">Rejection Reason</label>
              <div className="relative">
                <select className="w-full bg-[#F7F9FA] rounded-[10px] py-3.5 pl-4 pr-10 text-[14px] text-[#111827] font-medium appearance-none outline-none border border-gray-200 focus:border-[#004A8F] transition-colors">
                  <option>Select a reason for rejection</option>
                  <option>Allergy / Adverse Reaction</option>
                  <option>Drug Interaction</option>
                  <option>Incorrect Dosage</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#4A545E] pointer-events-none text-[22px]">expand_more</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-bold text-[#4A545E] uppercase tracking-widest mb-2">Pharmacist Notes</label>
              <textarea 
                rows={4} 
                placeholder="Enter clinical observations or notes for the prescribing physician..."
                className="w-full bg-[#F7F9FA] rounded-[10px] p-4 text-[14px] text-[#111827] outline-none border border-gray-200 focus:border-[#004A8F] transition-colors resize-none placeholder:text-[#9CA3AF]"
              ></textarea>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleAction('rejected')}
                className="w-full bg-[#C62828] text-white font-black py-4 rounded-[12px] text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:bg-[#A02022] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span> Reject Prescription
              </button>
              <button 
                onClick={() => handleAction('approved')}
                className="w-full bg-[#006644] text-white font-black py-4 rounded-[12px] text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-[#004A2F] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span> Approve Prescription
              </button>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="w-full mt-6 text-center text-[#004A8F] text-[14px] font-bold flex items-center justify-center gap-2 hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Return to Queue
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
