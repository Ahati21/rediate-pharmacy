import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PharmacistSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-[#F8FAFB] min-h-screen font-sans flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 bg-[#E6F0ED] rounded-[32px] flex items-center justify-center text-[#006644] mb-8 shadow-xl shadow-green-100">
        <span className="material-symbols-outlined text-[48px] font-black">person_check</span>
      </div>
      
      <h1 className="text-[32px] font-black text-[#111827] text-center mb-4 leading-tight">
        Pharmacist Added Successfully
      </h1>
      
      <p className="text-[15px] text-[#4B5563] text-center font-medium leading-relaxed mb-12 max-w-[280px]">
        The new professional has been registered in the system. An invitation email with login credentials has been sent.
      </p>

      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/pharmacists')}
          className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[20px] shadow-xl shadow-[#004A8F]/20 hover:bg-[#003870] transition-all"
        >
          View Staff List
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-white text-[#4B5563] font-black py-5 rounded-[20px] border border-gray-100 hover:bg-gray-50 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
