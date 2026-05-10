import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { SalesReportData } from '../types';

export default function SalesReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<SalesReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<SalesReportData>>('/dashboard/sales');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSalesData();
  }, []);

  const handleExport = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Medicine Name,Volume Sold,Revenue\n"
      + data.topMedications.map(m => `${m.name},${m.volume},${m.revenue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center bg-[#F7F9FA] dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-on-surface-variant font-bold">Compiling sales analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 pb-32 bg-[#F7F9FA] dark:bg-slate-900 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center text-[#004A8F] dark:text-blue-400 bg-white dark:bg-slate-800 shadow-sm"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-[#004A8F] dark:text-blue-400 leading-tight">Pharmacy<br/>Admin</h1>
          </div>
          <div className="h-8 w-[1px] bg-gray-300 dark:bg-slate-700 mx-2"></div>
          <div>
            <h1 className="text-[18px] font-bold text-[#004A8F] dark:text-blue-400 leading-tight">Sales<br/>Reports</h1>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
           <span className="material-symbols-outlined text-gray-500">account_circle</span>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-gray-500 dark:text-slate-400 text-[11px] font-bold tracking-[0.15em] uppercase block mb-2">Performance Analytics</span>
          <h2 className="text-[#111827] dark:text-white text-[28px] font-extrabold leading-[1.1] tracking-tight">Clinical Revenue Overview</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-[#EAECEE] dark:bg-slate-800 p-1 rounded-[12px]">
             <button className="px-5 py-2 text-[12px] font-bold text-[#4A545E] dark:text-slate-400 rounded-[10px] hover:text-[#111827] dark:hover:text-white">Daily</button>
             <button className="px-5 py-2 text-[12px] font-bold text-[#4A545E] dark:text-slate-400 rounded-[10px] hover:text-[#111827] dark:hover:text-white">Weekly</button>
             <button className="px-5 py-2 text-[12px] font-bold text-[#004A8F] dark:text-blue-400 bg-white dark:bg-slate-700 rounded-[10px] shadow-sm">Monthly</button>
          </div>
          <button 
            onClick={handleExport}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-[#D1D5DB] dark:border-slate-700 text-[#004A8F] dark:text-blue-400 font-bold py-2.5 px-6 rounded-[10px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span> Export CSV
          </button>
        </div>
      </div>

      {/* Grid Layout for Full Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stat Cards */}
        <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 tracking-widest uppercase mb-2">Total Revenue</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] dark:text-white leading-none">ETB {data.totalSales.toLocaleString()}</h3>
            <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full">+100%</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB] dark:bg-slate-700">
             <div className="h-full bg-[#004A8F] dark:bg-blue-600 w-[100%]"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 tracking-widest uppercase mb-2">Total Orders</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] dark:text-white leading-none">{data.totalOrders}</h3>
            <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full">Delivered</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB] dark:bg-slate-700">
             <div className="h-full bg-[#006644] dark:bg-emerald-600 w-[100%]"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-center h-full">
          <p className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 tracking-widest uppercase mb-2">Average Order Value</p>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[28px] font-bold text-[#111827] dark:text-white leading-none">ETB {data.averageOrderValue.toLocaleString()}</h3>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E5E7EB] dark:bg-slate-700">
             <div className="h-full bg-[#4A545E] dark:bg-slate-500 w-[100%]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Chart & Table) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart Placeholder */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1">
             <h3 className="text-[16px] font-bold text-[#111827] dark:text-white mb-1">Revenue Growth Trends</h3>
             <p className="text-[12px] text-[#6B7280] dark:text-slate-400 mb-6">Historical data analysis from system logs</p>
             
             <div className="flex-1 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-slate-700 min-h-[200px]">
                {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-3 h-full">
                     <div className="w-full max-w-[60px] h-full flex flex-col justify-end gap-[2px]">
                        <div className="w-full bg-[#CFD8DC] dark:bg-slate-700 rounded-t-[4px]" style={{ height: `${20 + (i * 10)}%` }}></div>
                        <div className="w-full bg-[#004A8F] dark:bg-blue-600 rounded-b-[4px]" style={{ height: `${40 + (i * 15)}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-[#9CA3AF] dark:text-slate-500">{month}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Profitability Matrix */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <h3 className="text-[16px] font-bold text-[#111827] dark:text-white mb-5">Product Performance Matrix</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-gray-100 dark:border-slate-700">
                     <th className="pb-3 text-[10px] font-bold text-[#9CA3AF] dark:text-slate-500 uppercase tracking-wider">Medication Name</th>
                     <th className="pb-3 text-[10px] font-bold text-[#9CA3AF] dark:text-slate-500 uppercase tracking-wider text-right">Volume Sold</th>
                     <th className="pb-3 text-[10px] font-bold text-[#9CA3AF] dark:text-slate-500 uppercase tracking-wider text-right">Total Revenue</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                   {data.topMedications.map((med, i) => (
                     <tr key={i}>
                       <td className="py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#EBF5FA] dark:bg-blue-900/30 text-[#004A8F] dark:text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                             {med.name.slice(0, 2).toUpperCase()}
                           </div>
                           <div>
                             <p className="text-[13px] font-bold text-[#111827] dark:text-white leading-tight">{med.name}</p>
                           </div>
                         </div>
                       </td>
                       <td className="py-4 text-right">
                         <p className="text-[13px] font-bold text-[#111827] dark:text-white leading-tight">{med.volume}</p>
                         <p className="text-[11px] text-[#6B7280] dark:text-slate-400">Units</p>
                       </td>
                       <td className="py-4 text-right">
                         <p className="text-[13px] font-bold text-[#004A8F] dark:text-blue-400 leading-tight">ETB {med.revenue.toLocaleString()}</p>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column (Top Meds & Insights) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Top Medications */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <h3 className="text-[16px] font-bold text-[#111827] dark:text-white mb-5">Top Performers</h3>
             
             <div className="space-y-5 mb-6">
               {data.topMedications.slice(0, 5).map((med, i) => (
                 <div key={i} className="flex gap-4 items-center">
                   <div className="w-10 h-10 rounded-[10px] bg-[#F2F4F5] dark:bg-slate-900 flex items-center justify-center shrink-0 text-[#004A8F] dark:text-blue-400">
                     <span className="material-symbols-outlined text-[20px]">pill</span>
                   </div>
                   <div className="flex-1">
                     <p className="text-[13px] font-bold text-[#111827] dark:text-white mb-0.5 truncate pr-2">{med.name}</p>
                     <p className="text-[9px] font-bold text-[#9CA3AF] dark:text-slate-500 uppercase tracking-wider">{med.volume} Units Sold</p>
                   </div>
                 </div>
               ))}
             </div>

             <button 
              onClick={() => navigate('/inventory')}
              className="w-full bg-[#F7F9FA] dark:bg-slate-900 text-[#004A8F] dark:text-blue-400 font-bold py-3 rounded-[10px] text-[13px] hover:bg-[#EAECEE] dark:hover:bg-slate-700 transition-colors"
             >
               Manage Inventory
             </button>
          </div>

          {/* Insights Banner */}
          <div className="bg-[#004A8F] dark:bg-blue-600 rounded-[16px] p-6 text-white shadow-[0_4px_15px_rgba(0,74,143,0.15)]">
             <span className="material-symbols-outlined text-[24px] mb-3 opacity-90">auto_awesome</span>
             <p className="text-[14px] font-medium leading-relaxed opacity-95">
               Your revenue is driven by <strong className="font-bold text-white">{data.topMedications[0]?.name || 'top medications'}</strong>. Keep stock levels optimized to meet consistent demand.
             </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

