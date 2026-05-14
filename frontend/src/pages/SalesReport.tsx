import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { SalesReportData } from '../types';

type SalesPeriod = 'daily' | 'weekly' | 'monthly';

const emptySalesTrend: SalesReportData['salesTrend'] = [];
const emptyTopMedications: SalesReportData['topMedications'] = [];

export default function SalesReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<SalesReportData | null>(null);
  const [period, setPeriod] = useState<SalesPeriod>('monthly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<SalesReportData>>(`/dashboard/sales?period=${period}`);
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSalesData();
  }, [period]);

  const handleExport = () => {
    if (!data) return;
    const exportTopMedications = Array.isArray(data.topMedications) ? data.topMedications : emptyTopMedications;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Medicine Name,Category,Volume Sold,Revenue,Profit\n"
      + exportTopMedications.map(m => `${m.name},${m.category},${m.volume},${m.revenue},${m.profit}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const periodButtonClass = (buttonPeriod: SalesPeriod) =>
    `px-8 py-2.5 text-[12px] font-bold rounded-[10px] transition-all duration-300 ${
      period === buttonPeriod
        ? 'text-[#004A8F] dark:text-blue-400 bg-white dark:bg-slate-700 shadow-md transform scale-105'
        : 'text-[#4A545E] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
    }`;

  const topMedications = Array.isArray(data?.topMedications) ? data.topMedications : emptyTopMedications;
  const salesTrend = Array.isArray(data?.salesTrend) ? data.salesTrend : emptySalesTrend;
  const maxTrendValue = Math.max(...salesTrend.map(item => Math.max(item.actual, item.projected)), 1);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center bg-[#F7F9FA] dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#004A8F]/20 rounded-full mb-4"></div>
          <p className="text-[#004A8F] dark:text-blue-400 font-black tracking-widest uppercase text-xs">Compiling Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F7F9FA] dark:bg-slate-900 font-sans pb-32">
      {/* Header - Fixed & Wider */}
      <div className="bg-white dark:bg-slate-800 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-[#111827] dark:text-white">dashboard</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-[16px] font-black text-[#004A8F] dark:text-blue-400 leading-tight">Rediate Pharmacy</h1>
              <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest">Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex bg-[#EAECEE] dark:bg-slate-900 p-1 rounded-[14px]">
               <button onClick={() => setPeriod('daily')} className={periodButtonClass('daily')}>Daily</button>
               <button onClick={() => setPeriod('weekly')} className={periodButtonClass('weekly')}>Weekly</button>
               <button onClick={() => setPeriod('monthly')} className={periodButtonClass('monthly')}>Monthly</button>
             </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 dark:border-slate-700 shadow-sm">
              <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=100" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[#004A8F] dark:text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase block mb-2">Internal Analytics</span>
            <h2 className="text-[#111827] dark:text-white text-[32px] md:text-[42px] font-black leading-tight tracking-tighter">Sales Performance</h2>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Mobile Period Selector (Hidden on Desktop) */}
             <div className="flex md:hidden bg-[#EAECEE] dark:bg-slate-800 p-1 rounded-[14px]">
               <button onClick={() => setPeriod('daily')} className={periodButtonClass('daily')}>D</button>
               <button onClick={() => setPeriod('weekly')} className={periodButtonClass('weekly')}>W</button>
               <button onClick={() => setPeriod('monthly')} className={periodButtonClass('monthly')}>M</button>
             </div>
             <button 
                onClick={handleExport}
                className="bg-[#111827] dark:bg-slate-800 text-white font-black px-8 py-4 rounded-[18px] text-[12px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 dark:shadow-none uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Export Report
              </button>
          </div>
        </div>

        {/* 1. Metric Cards - Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Sales', value: `ETB ${data.totalSales.toLocaleString()}`, change: `+${data.changes.sales}%`, color: '#004A8F', icon: 'payments' },
            { label: 'Net Profit', value: `ETB ${data.netProfit.toLocaleString()}`, change: `+${data.changes.profit}%`, color: '#006644', icon: 'trending_up' },
            { label: 'Avg Order Value', value: `ETB ${data.averageOrderValue.toLocaleString()}`, change: `${data.changes.avgValue}%`, color: '#4A545E', icon: 'shopping_basket' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-[28px] p-8 shadow-sm border border-white dark:border-slate-700/50 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#F8FAFB] dark:bg-slate-900 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <span className="material-symbols-outlined text-[24px]" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[11px] font-black text-[#9CA3AF] dark:text-slate-500 tracking-widest uppercase mb-1">{stat.label}</p>
              <h3 className="text-[28px] font-black text-[#111827] dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* 2. Main Content Grid - SIDE BY SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Trend Chart & Insights (Lg: 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Revenue Growth Trends Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-sm border border-white dark:border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="text-[20px] font-black text-[#111827] dark:text-white mb-1 tracking-tight">Revenue Growth Matrix</h3>
                  <p className="text-[12px] text-[#9CA3AF] dark:text-slate-500 font-medium">Comparative analysis of actual vs projected performance</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#004A8F]"></div>
                    <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D1E1EC] dark:bg-slate-600"></div>
                    <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Target</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end justify-between gap-4 h-[300px] px-2">
                 {salesTrend.map((item) => (
                   <div key={item.label} className="flex-1 flex flex-col items-center gap-4 h-full group relative">
                      <div className="w-full flex flex-col justify-end gap-[6px] h-full">
                         {/* Projected Bar */}
                         <div className="w-full bg-[#F2F4F7] dark:bg-slate-700/50 rounded-t-[8px] transition-all group-hover:bg-[#E5E7EB]" style={{ height: `${Math.max(10, (item.projected / maxTrendValue) * 100)}%` }}></div>
                         {/* Actual Bar */}
                         <div className="w-full bg-[#004A8F] dark:bg-blue-600 rounded-b-[6px] transition-all group-hover:saturate-150 shadow-xl shadow-blue-900/10" style={{ height: `${Math.max(20, (item.actual / maxTrendValue) * 100)}%` }}></div>
                      </div>
                      <span className="text-[11px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-2 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-xl whitespace-nowrap">
                        ETB {item.actual.toLocaleString()}
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Profitability Matrix Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-white dark:border-slate-700/50">
              <div className="p-8 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-[20px] font-black text-[#111827] dark:text-white tracking-tight">Medication Profitability Matrix</h3>
                <span className="bg-blue-50 dark:bg-blue-900/20 text-[#004A8F] dark:text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Live Feed
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFB] dark:bg-slate-900/50">
                      <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest text-left">Product Entity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest text-center">Volume Sold</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest text-center">In Stock</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest text-right">Profit Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {topMedications.map((med, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F0F7FF] dark:bg-blue-900/30 text-[#004A8F] dark:text-blue-400 font-black text-[11px] flex items-center justify-center group-hover:scale-110 transition-transform">
                              {med.name.split(' ')[0].slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[14px] font-black text-[#111827] dark:text-white leading-tight mb-0.5">{med.name}</p>
                              <p className="text-[10px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest">{med.category}</p>
                            </div>
                          </div>
                        </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-[15px] font-black text-[#111827] dark:text-white leading-none mb-1">{med.volume.toLocaleString()}</p>
                      <span className="text-[9px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-[0.2em]">Sold</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className={`text-[15px] font-black leading-none mb-1 ${(med.currentStock || 0) < 10 ? 'text-rose-600' : 'text-[#111827] dark:text-white'}`}>
                        {med.currentStock?.toLocaleString() || 0}
                      </p>
                      <span className="text-[9px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-[0.2em]">In Stock</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-[15px] font-black text-[#006644] dark:text-emerald-400 leading-none mb-1">ETB {med.profit.toLocaleString()}</p>
                      <span className="text-[9px] font-black text-emerald-600/60 dark:text-emerald-500/60 uppercase tracking-[0.2em]">+14.2% Yield</span>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Top Meds & Insights (Lg: 4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Top Medications Card */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-sm border border-white dark:border-slate-700/50">
              <h3 className="text-[20px] font-black text-[#111827] dark:text-white mb-8 tracking-tight">Best Sellers</h3>
              <div className="space-y-6">
                {topMedications.slice(0, 5).map((med, i) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-[#F2F4F5] dark:bg-slate-900 flex items-center justify-center text-[#004A8F] dark:text-blue-400 group-hover:bg-[#004A8F] group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined text-[28px]">{med.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-black text-[#111827] dark:text-white leading-tight mb-0.5">{med.name}</h4>
                      <p className="text-[11px] font-black text-[#9CA3AF] dark:text-slate-500 uppercase tracking-widest">{med.volume} Orders</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[14px] font-black text-[#111827] dark:text-white">#{i+1}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/inventory')} className="w-full mt-10 py-5 rounded-[22px] bg-[#F8FAFB] dark:bg-slate-900 text-[#004A8F] dark:text-blue-400 font-black text-[13px] uppercase tracking-widest hover:bg-[#004A8F] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-sm shadow-blue-100">
                Manage Inventory
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </button>
            </div>

            {/* Smart Insight Banner */}
            <div className="bg-[#004A8F] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full scale-150 transition-transform duration-700 group-hover:scale-[1.7]"></div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <span className="material-symbols-outlined text-white text-[24px] animate-pulse">auto_awesome</span>
                 </div>
                 <h4 className="text-[18px] font-black mb-4 leading-tight">Demand Intelligence</h4>
                 <p className="text-[15px] font-medium leading-relaxed opacity-90 mb-8">
                   Predictive analysis indicates a <span className="font-black underline decoration-2 decoration-blue-400 underline-offset-4">22% surge</span> in respiratory treatments over the next 14 days based on regional clinical data.
                 </p>
                 <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <span className="material-symbols-outlined text-[20px] text-blue-300">info</span>
                    <p className="text-[11px] font-black uppercase tracking-wider">Stock Optimization Recommended</p>
                 </div>
              </div>
            </div>

            {/* Performance Summary Mini Card */}
            <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-900/20">
               <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-4">Quarterly Goal</p>
               <div className="flex items-end justify-between mb-2">
                 <h3 className="text-[32px] font-black">84%</h3>
                 <span className="text-[12px] font-black bg-white/20 px-3 py-1 rounded-lg mb-2">On Track</span>
               </div>
               <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full" style={{ width: '84%' }}></div>
               </div>
               <p className="text-[11px] font-medium mt-4 opacity-80 leading-relaxed">
                 You are currently <span className="font-black">ETB 240,500</span> away from your clinical revenue target for Q2.
               </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation - Desktop Centered & Modern */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-gray-100 dark:border-slate-700 py-3 px-8 flex gap-12 rounded-[28px] z-[100] shadow-2xl shadow-blue-900/10">
        <button onClick={() => navigate('/inventory')} className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#004A8F] transition-all hover:scale-110">
          <span className="material-symbols-outlined font-black text-[22px]">inventory_2</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Inventory</span>
        </button>
        <button onClick={() => navigate('/pharmacists')} className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#004A8F] transition-all hover:scale-110">
          <span className="material-symbols-outlined font-black text-[22px]">medical_services</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Staff</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#004A8F] dark:text-blue-400 font-bold px-6">
          <span className="material-symbols-outlined font-black text-[22px]">bar_chart</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Reports</span>
          <div className="w-1 h-1 bg-[#004A8F] dark:bg-blue-400 rounded-full mt-0.5"></div>
        </button>
      </nav>
    </div>
  );
}
