import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScriptUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#004A8F] rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">medical_services</span>
          </div>
          <h1 className="text-[18px] font-black text-[#111827]">Rediate Pharmacy</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-6 pt-8 pb-4">
        <p className="text-[11px] font-black text-[#004A8F] uppercase tracking-[0.25em] mb-3">Prescription Portal</p>
        <h2 className="text-[36px] font-black text-[#111827] leading-tight mb-4">Secure Script Submission</h2>
        <p className="text-[14px] text-[#4B5563] font-medium leading-relaxed mb-8">
          Upload your digital script or a clear photo of your physical prescription. Our clinical team will begin the verification process immediately.
        </p>

        {/* Review Badge */}
        <div className="bg-[#E6F0ED] border-l-4 border-[#006644] rounded-r-[16px] p-5 flex items-center gap-4 mb-10">
          <div className="w-10 h-10 bg-[#006644] rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">timer</span>
          </div>
          <div>
            <h4 className="text-[15px] font-black text-[#006644]">15 Minute Review</h4>
            <p className="text-[12px] font-medium text-[#4B5563]">Our clinical team will review this within 15 minutes.</p>
          </div>
        </div>

        {/* Upload Box */}
        <div 
          onClick={handleBrowseClick}
          className="bg-white rounded-[32px] p-8 border-2 border-dashed border-gray-200 flex flex-col items-center text-center mb-10 group hover:border-[#004A8F] transition-all cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={(e) => console.log('File selected:', e.target.files?.[0])}
          />
          <div className="w-16 h-16 bg-[#EBF5FA] text-[#004A8F] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[32px]">photo_camera</span>
          </div>
          <h3 className="text-[18px] font-black text-[#111827] mb-2">Select Photo or Drag & Drop</h3>
          <p className="text-[12px] font-medium text-[#6B7280] mb-6">JPG, PNG or PDF (Max 10MB)</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
            className="px-8 py-3 border-2 border-gray-100 rounded-xl text-[14px] font-black text-[#004A8F] hover:bg-gray-50 transition-all shadow-sm"
          >
            Browse Files
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6 mb-10">
          <div>
            <label className="text-[12px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Doctor Name</label>
            <input 
              type="text" 
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all"
            />
          </div>
          <div>
            <label className="text-[12px] font-black text-[#111827] uppercase tracking-widest block mb-2 px-1">Additional Notes</label>
            <textarea 
              rows={4}
              placeholder="Any specific instructions for our pharmacists..."
              className="w-full bg-[#F3F4F6] border-none rounded-[16px] px-6 py-4 text-[14px] font-medium focus:ring-2 focus:ring-[#004A8F] transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={() => navigate('/prescription-approved')}
          className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          Submit for Approval
        </button>

        <p className="text-[10px] text-[#6B7280] text-center mt-6 px-8 leading-relaxed font-medium">
          By submitting, you agree to our terms of service regarding medical data privacy and processing.
        </p>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-bold uppercase">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#F3F4F6] text-[#004A8F] px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] font-black uppercase">Upload</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-bold uppercase">Cart</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}
