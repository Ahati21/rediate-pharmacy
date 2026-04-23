import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function PharmacistQueue() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const prescriptions = [
    {
      id: '1',
      med: 'Amoxicillin 500mg',
      patient: 'Elias Tesfaye',
      type: 'URGENT',
      typeColor: 'bg-[#CBE3FA] text-[#004A8F]',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2',
      med: 'Metformin 850mg',
      patient: 'Selamawit Kassa',
      type: 'ROUTINE',
      typeColor: 'bg-[#E1E3E5] text-[#4A545E]',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3',
      med: 'Lisinopril 10mg',
      patient: 'Kebede Wolde',
      type: 'ROUTINE',
      typeColor: 'bg-[#E1E3E5] text-[#4A545E]',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const payments = [
    { method: 'TELEBIRR', order: '#8821', amount: '450.00' },
    { method: 'CBE BIRR', order: '#8819', amount: '1,200.00' },
    { method: 'TELEBIRR', order: '#8815', amount: '89.50' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-32 bg-[#F7F9FA] dark:bg-slate-900 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <span className="text-xs font-bold tracking-[0.2em] text-[#6B7280] dark:text-slate-400 uppercase mb-2 block">Clinical Workflow</span>
           <h1 className="text-[32px] md:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-tight">Prescription Queue</h1>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100 dark:border-slate-700 shadow-sm">
             <div className="w-2 h-2 bg-[#006644] rounded-full animate-pulse"></div>
             <span className="text-[14px] font-bold text-[#111827] dark:text-slate-300">Active Session</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* 1. Notification Banner */}
          <div className="bg-[#2E7DAA] rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center justify-between mb-8 shadow-sm gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[24px]">notifications_active</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-[16px] mb-0.5 tracking-tight">New Prescription Uploaded</h3>
                <p className="text-white/80 text-[13px]">Patient: <strong className="text-white">Abebe Bikila</strong> • Just now</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-white text-[#2E7DAA] font-bold py-2.5 px-6 rounded-[8px] text-[13px] shadow-sm hover:bg-gray-50 transition-colors shrink-0">
              Review Now
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            {/* 3. Title */}
            <div>
              <span className="text-gray-500 text-[11px] font-bold tracking-[0.15em] uppercase block mb-2">Clinical Queue</span>
              <h2 className="text-[#111827] text-[32px] font-extrabold leading-[1.1] tracking-tight">Pending<br className="md:hidden"/>Prescriptions</h2>
            </div>
            
            {/* 2. Search */}
            <div className="w-full md:w-96 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search medication info, price..." 
                  className="w-full bg-white rounded-[12px] py-3.5 pl-12 pr-4 text-[14px] text-[#4B5563] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button className="text-[#004A8F] text-[13px] font-bold hover:underline">
              View All Queue &rarr;
            </button>
          </div>

          {/* 4. Prescriptions List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {prescriptions.map((p) => (
              <div key={p.id} className="bg-white rounded-[16px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-md transition-shadow">
                <div className="h-[160px] w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                   <img src={p.image} className="w-full h-full object-cover object-center" alt="Prescription snippet" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-[#111827] text-[16px]">{p.med}</h3>
                     <span className={`${p.typeColor} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>{p.type}</span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] mb-6">Patient: {p.patient}</p>
                  <button 
                    onClick={() => navigate('/pharmacist/review')}
                    className="mt-auto w-full bg-[#004A2F] text-white font-bold py-3 rounded-[8px] text-[14px] flex items-center justify-center gap-2 hover:bg-[#003823] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span> Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Side Content */}
        <div className="lg:col-span-1">
          {/* 5. Payment Reconciliation */}
          <div className="bg-[#F2F4F5] rounded-[24px] p-6 sticky top-24">
            <div className="flex gap-4 items-center mb-2">
               <div className="w-12 h-12 rounded-[12px] bg-[#004A2F] flex items-center justify-center text-white shrink-0 shadow-sm">
                 <span className="material-symbols-outlined text-[24px]">payments</span>
               </div>
               <div>
                 <h3 className="font-bold text-[#111827] text-[18px] leading-[1.2]">Payment<br/>Reconciliation</h3>
               </div>
            </div>
            <p className="text-[13px] text-[#6B7280] mb-6">Confirm bank/mobile transfers</p>
            
            <div className="space-y-4">
               {payments.map((pay, i) => (
                 <div key={i} className="bg-white rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border-l-4 border-[#004A2F] gap-4 sm:gap-2">
                   <div className="flex-1">
                     <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">{pay.method}</p>
                     <p className="text-[14px] font-bold text-[#111827]">Order {pay.order}</p>
                   </div>
                   <div className="flex-1 sm:text-center sm:pr-4 sm:border-r border-gray-100">
                     <p className="text-[11px] text-[#004A8F] font-bold mb-1">ETB</p>
                     <p className="text-[16px] text-[#004A8F] font-bold">{pay.amount}</p>
                   </div>
                   <div className="flex-1 sm:text-right sm:pl-2">
                     <button className="text-[13px] text-[#004A2F] font-bold leading-tight hover:underline text-left sm:text-right w-full sm:w-auto">
                       Confirm<br className="hidden sm:block"/>Payment
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
