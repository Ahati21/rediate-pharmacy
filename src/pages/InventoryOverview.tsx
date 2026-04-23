import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InventoryOverview() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-32 bg-[#F7F9FA] min-h-screen font-sans">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Expired Stock */}
        <div className="bg-[#FDECEC] rounded-[24px] p-6 shadow-sm border border-[#F5C2C7] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center text-[#C62828] shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[24px]">event_busy</span>
            </div>
            <span className="bg-white/60 text-[#C62828] text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Critical</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#C62828] uppercase tracking-[0.15em] mb-1">Expired Stock</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[42px] font-black text-[#C62828] leading-none tracking-tight">12</h3>
              <span className="text-[14px] font-bold text-[#C62828]">SKUs</span>
            </div>
            <p className="text-[12px] text-[#C62828]/80 font-medium italic leading-snug">
              Requires immediate removal from active<br/>inventory shelves.
            </p>
          </div>
        </div>

        {/* Near Expiry */}
        <div className="bg-[#D1EAF5] rounded-[24px] p-6 shadow-sm border border-[#BDE0F2] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center text-[#4A545E] shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[24px]">history</span>
            </div>
            <span className="bg-white/50 text-[#4A545E] text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">30 Days</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#4A545E] uppercase tracking-[0.15em] mb-1">Near Expiry</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[42px] font-black text-[#4A545E] leading-none tracking-tight">48</h3>
              <span className="text-[14px] font-bold text-[#4A545E]">Items</span>
            </div>
            <p className="text-[12px] text-[#4A545E]/80 font-medium italic leading-snug">
              Prioritize distribution or mark for early return to<br/>supplier.
            </p>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-[#004A8F] rounded-[24px] p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-sm backdrop-blur-md">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Refill Needed</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.15em] mb-1">Low Stock</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[42px] font-black text-white leading-none tracking-tight">24</h3>
              <span className="text-[14px] font-bold text-blue-100">Thresholds</span>
            </div>
            <p className="text-[12px] text-blue-200/90 font-medium italic leading-snug">
              Current inventory levels are below 15% of<br/>standard capacity.
            </p>
          </div>
        </div>

      </div>

      {/* Inventory Section */}
      <div className="mb-6">
        <h2 className="text-[28px] font-extrabold text-[#111827] tracking-tight mb-1">Medicine Inventory</h2>
        <p className="text-[#6B7280] text-[14px] mb-6">Manage and monitor 1,402 medication records</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">search</span>
            <input 
              type="text" 
              placeholder="Search by medicine name, SKU or category..."
              className="w-full bg-white border border-gray-200 rounded-[12px] py-3.5 pl-12 pr-4 text-[14px] outline-none focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/10 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate('/add-medicine')}
            className="bg-[#004A8F] text-white font-bold py-3.5 px-6 rounded-[12px] text-[14px] flex items-center justify-center gap-2 hover:bg-[#003870] transition-colors shadow-md shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Add New Medicine
          </button>
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  <th className="py-4 px-6 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-[0.15em]">Medicine Details</th>
                  <th className="py-4 px-6 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-[0.15em]">Category</th>
                  <th className="py-4 px-6 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-[0.15em]">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
                        <div className="w-full h-full bg-white/20 backdrop-blur-sm mix-blend-overlay"></div>
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-[#111827] mb-0.5">Amoxicillin<br/>500mg</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[11px] text-[#6B7280]">SKU: AMX-2024-001</p>
                          <span className="flex items-center gap-1 text-[9px] font-bold bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[10px]">schedule</span> Expires in 8 days
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-3 py-1 rounded-full">Antibiotics</span>
                  </td>
                  <td className="py-5 px-6">
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-[#006644] rounded-full"></div>
                        </div>
                     </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 overflow-hidden p-2">
                         <div className="w-full h-full bg-blue-500 rounded flex items-center justify-center text-[8px] font-bold text-white uppercase text-center leading-none">Panadol<br/>Extra</div>
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-[#111827] mb-0.5">Panadol<br/>Extra</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-[11px] text-[#6B7280]">SKU: PAN-2024-042</p>
                          <span className="flex items-center gap-1 text-[9px] font-bold bg-[#FDECEC] text-[#C62828] px-2 py-0.5 rounded-full w-max">
                            <span className="material-symbols-outlined text-[10px]">warning</span> Expires in 2 days
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-3 py-1 rounded-full">Analgesics</span>
                  </td>
                  <td className="py-5 px-6">
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[12%] h-full bg-[#C62828] rounded-full"></div>
                        </div>
                     </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#111827] shadow-inner flex items-center justify-center shrink-0 overflow-hidden relative">
                         <div className="absolute inset-0 border-[4px] border-white/10 rounded-xl"></div>
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-[#111827] mb-0.5">Insulin<br/>Glargine</p>
                        <p className="text-[11px] text-[#6B7280]">SKU: INS-2024-912</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-3 py-1 rounded-full">Endocrine</span>
                  </td>
                  <td className="py-5 px-6">
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[45%] h-full bg-[#4A545E] rounded-full"></div>
                        </div>
                     </div>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-100 to-blue-50 border border-gray-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-[#111827] mb-0.5">Omeprazole<br/>20mg</p>
                        <p className="text-[11px] text-[#6B7280]">SKU: OME-2024-115</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-3 py-1 rounded-full">Gastrointestinal</span>
                  </td>
                  <td className="py-5 px-6">
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[72%] h-full bg-[#006644] rounded-full"></div>
                        </div>
                     </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FAFB]">
            <p className="text-[12px] text-[#6B7280] font-medium">
              Showing 1 to 4 of 1,402 medicines
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#004A8F] text-white font-bold text-[13px] shadow-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 text-[#111827] font-bold text-[13px] transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 text-[#111827] font-bold text-[13px] transition-colors">
                3
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
