import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SalesReport() {
  const navigate = useNavigate();

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Category,Revenue,Profit\n"
      + "2024-03-01,Antibiotics,45000,12000\n"
      + "2024-03-02,Hypertension,32000,8500";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report_march_2024.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 pb-32 bg-[#F7F9FA] min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center text-[#004A8F] bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-[#004A8F] leading-tight">Pharmacy<br/>Admin</h1>
          </div>
          <div className="h-8 w-[1px] bg-gray-300 mx-2"></div>
          <div>
            <h1 className="text-[18px] font-bold text-[#004A8F] leading-tight">Sales<br/>Reports</h1>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
           <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" alt="Admin" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-gray-500 text-[11px] font-bold tracking-[0.15em] uppercase block mb-2">Performance Analytics</span>
          <h2 className="text-[#111827] text-[28px] font-extrabold leading-[1.1] tracking-tight">Clinical Revenue Overview</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-[#EAECEE] p-1 rounded-[12px]">
             <button className="px-5 py-2 text-[12px] font-bold text-[#4A545E] rounded-[10px] hover:text-[#111827]">Daily</button>
             <button className="px-5 py-2 text-[12px] font-bold text-[#4A545E] rounded-[10px] hover:text-[#111827]">Weekly</button>
             <button className="px-5 py-2 text-[12px] font-bold text-[#004A8F] bg-white rounded-[10px] shadow-sm">Monthly</button>
          </div>
          <button 
            onClick={handleExport}
            className="w-full sm:w-auto bg-white border border-[#D1D5DB] text-[#004A8F] font-bold py-2.5 px-6 rounded-[10px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span> Export CSV
          </button>
        </div>
      </div>

      {/* Grid Layout for Full Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stat Cards */}
        <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase mb-2">Total Sales</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] leading-none">ETB 142,580.00</h3>
            <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB]">
             <div className="h-full bg-[#004A8F] w-[75%]"></div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase mb-2">Net Profit</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] leading-none">ETB 48,210.50</h3>
            <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full">+8.1%</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB]">
             <div className="h-full bg-[#006644] w-[60%]"></div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase mb-2">Average Order Value</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] leading-none">ETB 84.30</h3>
            <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded-full">-2.1%</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB]">
             <div className="h-full bg-[#4A545E] w-[45%]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Chart & Table) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1">
             <h3 className="text-[16px] font-bold text-[#111827] mb-1">Revenue Growth Trends</h3>
             <p className="text-[12px] text-[#6B7280] mb-6">Projected vs actual earnings over 30 days</p>
             
             {/* Stacked Bar Chart Mockup */}
             <div className="flex-1 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-dashed border-gray-100 min-h-[200px]">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
                  <div key={week} className="flex-1 flex flex-col items-center gap-3 h-full">
                     <div className="w-full max-w-[60px] h-full flex flex-col justify-end gap-[2px]">
                        <div className="w-full bg-[#CFD8DC] rounded-t-[4px]" style={{ height: `${30 + (i * 5)}%` }}></div>
                        <div className="w-full bg-[#004A8F] rounded-b-[4px]" style={{ height: `${50 + (i * 10)}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-[#9CA3AF]">{week}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Profitability Matrix */}
          <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <h3 className="text-[16px] font-bold text-[#111827] mb-5">Profitability Matrix</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-gray-100">
                     <th className="pb-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Medication Name</th>
                     <th className="pb-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Volume Sold</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   <tr>
                     <td className="py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#004A8F] font-bold text-[10px] flex items-center justify-center shrink-0">AM</div>
                         <div>
                           <p className="text-[13px] font-bold text-[#111827] leading-tight">Amoxicillin</p>
                           <p className="text-[11px] text-[#6B7280]">500mg</p>
                         </div>
                       </div>
                     </td>
                     <td className="py-4">
                       <p className="text-[13px] font-bold text-[#111827] leading-tight">1,240</p>
                       <p className="text-[11px] text-[#6B7280]">Units</p>
                     </td>
                   </tr>
                   <tr>
                     <td className="py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#F4F5F7] text-[#4A545E] font-bold text-[10px] flex items-center justify-center shrink-0">LI</div>
                         <div>
                           <p className="text-[13px] font-bold text-[#111827] leading-tight">Lisinopril</p>
                           <p className="text-[11px] text-[#6B7280]">10mg</p>
                         </div>
                       </div>
                     </td>
                     <td className="py-4">
                       <p className="text-[13px] font-bold text-[#111827] leading-tight">942</p>
                       <p className="text-[11px] text-[#6B7280]">Units</p>
                     </td>
                   </tr>
                   <tr>
                     <td className="py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#004A8F] font-bold text-[10px] flex items-center justify-center shrink-0">AT</div>
                         <div>
                           <p className="text-[13px] font-bold text-[#111827] leading-tight">Atorvastatin</p>
                           <p className="text-[11px] text-[#6B7280]">20mg</p>
                         </div>
                       </div>
                     </td>
                     <td className="py-4">
                       <p className="text-[13px] font-bold text-[#111827] leading-tight">812</p>
                       <p className="text-[11px] text-[#6B7280]">Units</p>
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column (Top Meds & Insights) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Top Medications */}
          <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <h3 className="text-[16px] font-bold text-[#111827] mb-5">Top Medications</h3>
             
             <div className="space-y-5 mb-6">
               <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-[10px] bg-[#F2F4F5] flex items-center justify-center shrink-0 text-[#004A8F]">
                   <span className="material-symbols-outlined text-[20px] rotate-45">pill</span>
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-[#111827] mb-0.5">Amoxicillin 500mg</p>
                   <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">Antibiotics</p>
                 </div>
               </div>
               
               <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-[10px] bg-[#F2F4F5] flex items-center justify-center shrink-0 text-[#004A8F]">
                   <span className="material-symbols-outlined text-[20px]">medication</span>
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-[#111827] mb-0.5">Lisinopril 10mg</p>
                   <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">Hypertension</p>
                 </div>
               </div>
               
               <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-[10px] bg-[#F2F4F5] flex items-center justify-center shrink-0 text-[#004A8F]">
                   <span className="material-symbols-outlined text-[20px]">vaccines</span>
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-[#111827] mb-0.5">Atorvastatin 20mg</p>
                   <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">Cholesterol</p>
                 </div>
               </div>
             </div>

             <button className="w-full bg-[#F7F9FA] text-[#004A8F] font-bold py-3 rounded-[10px] text-[13px] hover:bg-[#EAECEE] transition-colors">
               View Inventory
             </button>
          </div>

          {/* Insights Banner */}
          <div className="bg-[#004A8F] rounded-[16px] p-6 text-white shadow-[0_4px_15px_rgba(0,74,143,0.15)]">
             <span className="material-symbols-outlined text-[24px] mb-3 opacity-90">auto_awesome</span>
             <p className="text-[14px] font-medium leading-relaxed opacity-95">
               Prescription renewals for chronic care are up <strong className="font-bold text-white">15%</strong>. Ensure sufficient stock of Hypertension and Cholesterol medications.
             </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
