import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiListResponse } from '../lib/api';
import { Medication } from '../types';

export default function InventoryOverview() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = React.useState<Medication[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function loadMedicines() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiListResponse<Medication>>('/medicines');
        setMedicines(response.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load inventory');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMedicines();
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const term = search.toLowerCase();
    return (
      medicine.name.toLowerCase().includes(term) ||
      medicine.batchNumber.toLowerCase().includes(term) ||
      medicine.category.toLowerCase().includes(term)
    );
  });

  const pendingCount = medicines.filter((medicine) => medicine.status === 'Pending').length;
  const expiringCount = medicines.filter((medicine) => medicine.status === 'Expiring').length;
  const lowStockCount = medicines.filter((medicine) => medicine.stock <= 15 || medicine.status === 'Low Stock').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-32 bg-[#F7F9FA] min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#FDECEC] rounded-[24px] p-6 shadow-sm border border-[#F5C2C7] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center text-[#C62828] shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[24px]">event_busy</span>
            </div>
            <span className="bg-white/60 text-[#C62828] text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Attention</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#C62828] uppercase tracking-[0.15em] mb-1">Pending Review</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[42px] font-black text-[#C62828] leading-none tracking-tight">{pendingCount}</h3>
              <span className="text-[14px] font-bold text-[#C62828]">SKUs</span>
            </div>
            <p className="text-[12px] text-[#C62828]/80 font-medium italic leading-snug">
              Newly added medicines waiting for administrative confirmation.
            </p>
          </div>
        </div>

        <div className="bg-[#D1EAF5] rounded-[24px] p-6 shadow-sm border border-[#BDE0F2] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center text-[#4A545E] shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[24px]">history</span>
            </div>
            <span className="bg-white/50 text-[#4A545E] text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Watch List</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#4A545E] uppercase tracking-[0.15em] mb-1">Near Expiry</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[42px] font-black text-[#4A545E] leading-none tracking-tight">{expiringCount}</h3>
              <span className="text-[14px] font-bold text-[#4A545E]">Items</span>
            </div>
            <p className="text-[12px] text-[#4A545E]/80 font-medium italic leading-snug">
              Prioritize distribution or plan replacement for at-risk medicines.
            </p>
          </div>
        </div>

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
              <h3 className="text-[42px] font-black text-white leading-none tracking-tight">{lowStockCount}</h3>
              <span className="text-[14px] font-bold text-blue-100">Thresholds</span>
            </div>
            <p className="text-[12px] text-blue-200/90 font-medium italic leading-snug">
              Items under the alert threshold need replenishment planning.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-[28px] font-extrabold text-[#111827] tracking-tight mb-1">Medicine Inventory</h2>
        <p className="text-[#6B7280] text-[14px] mb-6">Manage and monitor {medicines.length} medication records</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">search</span>
            <input
              type="text"
              placeholder="Search by medicine name, batch or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-[12px] py-3.5 pl-12 pr-4 text-[14px] outline-none focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/10 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => navigate('/add-medicine')}
            className="bg-[#004A8F] text-white font-bold py-3.5 px-6 rounded-[12px] text-[14px] flex items-center justify-center gap-2 hover:bg-[#003870] transition-colors shadow-md shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New Medicine
          </button>
        </div>

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
                {isLoading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm font-medium text-[#6B7280]">
                      Loading inventory...
                    </td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm font-medium text-red-600">
                      {error}
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm font-medium text-[#6B7280]">
                      No medicines match your search.
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filteredMedicines.map((medicine) => {
                  const stockPercent = Math.min(100, Math.max(8, Math.round((medicine.stock / 150) * 100)));
                  const stockColor = medicine.stock <= 15 ? '#C62828' : medicine.status === 'Expiring' ? '#4A545E' : '#006644';

                  return (
                    <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
                            <span className="material-symbols-outlined text-white text-[18px]">
                              {medicine.type === 'medication_liquid' ? 'water_drop' : medicine.type === 'vaccines' ? 'vaccines' : 'medication'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[14px] font-extrabold text-[#111827] mb-0.5">
                              {medicine.name}
                              <br />
                              {medicine.dosage}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[11px] text-[#6B7280]">Batch: {medicine.batchNumber}</p>
                              <span className="flex items-center gap-1 text-[9px] font-bold bg-[#EBF5FA] text-[#004A8F] px-2 py-0.5 rounded-full">
                                {medicine.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-3 py-1 rounded-full">{medicine.category}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${stockPercent}%`, backgroundColor: stockColor }}></div>
                          </div>
                          <span className="text-[12px] font-bold text-[#111827]">{medicine.stock}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FAFB]">
            <p className="text-[12px] text-[#6B7280] font-medium">
              Showing {filteredMedicines.length} of {medicines.length} medicines
            </p>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#6B7280]">
              Live from MongoDB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
