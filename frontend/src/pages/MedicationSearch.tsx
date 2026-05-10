import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiListResponse } from '../lib/api';
import { Medication } from '../types';
import { useOrder } from '../OrderContext';

export default function MedicationSearch() {
  const navigate = useNavigate();
  const { setOrderDraft } = useOrder();
  const [query, setQuery] = React.useState('');
  const [medicines, setMedicines] = React.useState<Medication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function loadMedicines() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiListResponse<Medication>>('/medicines');
        setMedicines(response.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load medicines');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMedicines();
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return (
      medicine.name.toLowerCase().includes(normalizedQuery) ||
      medicine.category.toLowerCase().includes(normalizedQuery) ||
      medicine.dosage.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleAddToCheckout = (medicine: Medication) => {
    setOrderDraft({
      items: [
        {
          name: `${medicine.name} ${medicine.dosage}`,
          quantity: 1,
          unitPrice: medicine.price,
        },
      ],
      subtotal: medicine.price,
      tax: Number((medicine.price * 0.05).toFixed(2)),
      deliveryFee: 0,
      totalAmount: Number((medicine.price * 1.05).toFixed(2)),
    });
    navigate('/cart');
  };

  const featuredMedicine = filteredMedicines[0];
  const otherMedicines = filteredMedicines.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32 bg-[#F8FAFB] min-h-screen font-sans">
      <div className="flex items-center justify-between mb-8 px-2 mt-4">
        <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight">Find Your Medication</h1>
      </div>

      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[#004A8F] text-[20px]">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border-none rounded-[20px] py-5 pl-14 pr-14 text-[16px] font-bold text-[#111827] shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-[#004A8F]/10 transition-all outline-none"
        />
        <div className="absolute inset-y-0 right-5 flex items-center cursor-pointer">
          <span className="material-symbols-outlined text-[#6B7280]">tune</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-10 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Popular:</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button onClick={() => setQuery('Paracetamol')} className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Paracetamol</button>
            <button onClick={() => setQuery('Amoxicillin')} className="bg-gray-100 text-[#6B7280] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Amoxicillin</button>
            <button onClick={() => setQuery('Insulin')} className="bg-gray-100 text-[#6B7280] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Insulin</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <p className="text-[9px] font-black text-[#004A8F] uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#004A8F] rounded-full"></span>
            Medications Found
          </p>
          <h2 className="text-[18px] font-extrabold text-[#111827]">{filteredMedicines.length} Matches for '{query || 'all medicines'}'</h2>
        </div>
        <button className="flex items-center gap-1.5 text-[#6B7280] text-[10px] font-bold uppercase tracking-widest hover:text-[#004A8F] transition-colors">
          <span className="material-symbols-outlined text-[16px]">database</span>
          Live Catalog
        </button>
      </div>

      {isLoading && <div className="rounded-[24px] bg-white p-8 text-center text-sm font-medium text-[#6B7280] shadow-sm">Loading medicines...</div>}
      {!isLoading && error && <div className="rounded-[24px] bg-white p-8 text-center text-sm font-medium text-red-600 shadow-sm">{error}</div>}

      {!isLoading && !error && filteredMedicines.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMedicine && (
            <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
              <div className="w-full aspect-square bg-[#F3F4F6] rounded-[24px] mb-6 overflow-hidden flex items-center justify-center p-4">
                <span className="material-symbols-outlined text-[#004A8F] text-[72px]">
                  {featuredMedicine.type === 'medication_liquid' ? 'water_drop' : featuredMedicine.type === 'vaccines' ? 'vaccines' : 'medication'}
                </span>
              </div>
              <div className="w-full flex justify-between items-start mb-2">
                <span className="bg-[#E6F4EA] text-[#006644] text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#006644] rounded-full"></span>
                  {featuredMedicine.status}
                </span>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Price</p>
                  <p className="text-[24px] font-black text-[#004A8F] leading-none">{featuredMedicine.price.toFixed(2)} <span className="text-[10px] font-bold text-[#6B7280]">ETB</span></p>
                </div>
              </div>
              <h3 className="w-full text-[20px] font-extrabold text-[#111827] mb-1">{featuredMedicine.name}</h3>
              <p className="w-full text-[13px] font-medium text-[#6B7280] mb-8">{featuredMedicine.dosage} • Batch {featuredMedicine.batchNumber}</p>

              <button onClick={() => handleAddToCheckout(featuredMedicine)} className="w-full bg-[#004A8F] text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 mb-3 shadow-lg shadow-[#004A8F]/20 hover:bg-[#003870] transition-all active:scale-95">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                Add to Cart
              </button>
              <button className="w-full bg-white text-[#111827] font-bold py-4 rounded-[16px] border border-gray-200 hover:bg-gray-50 transition-all">
                {featuredMedicine.category}
              </button>
            </div>
          )}

          {otherMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col">
              <div className="relative mb-6">
                <div className="w-full aspect-[4/3] bg-[#F3F4F6] rounded-[24px] overflow-hidden flex items-center justify-center p-4">
                  <span className="material-symbols-outlined text-[#004A8F] text-[56px]">
                    {medicine.type === 'medication_liquid' ? 'water_drop' : medicine.type === 'vaccines' ? 'vaccines' : 'medication'}
                  </span>
                </div>
                <span className="absolute top-4 left-4 bg-gray-200/80 backdrop-blur-md text-[#4B5563] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {medicine.status}
                </span>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#111827] mb-0.5">{medicine.name}</h3>
              <p className="text-[12px] font-medium text-[#6B7280] mb-6">{medicine.dosage} | {medicine.category}</p>

              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Price</p>
                  <p className="text-[18px] font-black text-[#111827]">{medicine.price.toFixed(2)} <span className="text-[9px] font-bold text-[#6B7280]">ETB</span></p>
                </div>
                <button onClick={() => handleAddToCheckout(medicine)} className="w-12 h-12 bg-[#F3F4F6] rounded-[14px] flex items-center justify-center text-[#004A8F] hover:bg-[#004A8F] hover:text-white transition-all shadow-sm active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredMedicines.length === 0 && (
        <div className="rounded-[24px] bg-white p-8 text-center text-sm font-medium text-[#6B7280] shadow-sm">
          No medicines matched your search.
        </div>
      )}

      <button className="fixed bottom-32 right-6 w-14 h-14 bg-[#004A8F] text-white rounded-[18px] flex items-center justify-center shadow-xl z-30 hover:scale-110 transition-transform">
        <span className="material-symbols-outlined">tune</span>
      </button>
    </div>
  );
}
