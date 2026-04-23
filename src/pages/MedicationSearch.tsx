import React from 'react';
import { useNavigate } from 'react-router-dom';

const MEDICATIONS = [
  {
    id: 1,
    name: "Amoxicillin Capsules",
    dosage: "500mg",
    count: "30 Capsules",
    price: 500.00,
    badge: "AVAILABLE",
    type: "Featured",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Amoxicillin Oral Suspension",
    dosage: "250mg/5ml",
    count: "100ml Bottle",
    price: 320.00,
    badge: "PEDIATRIC",
    image: "https://images.unsplash.com/photo-1550573105-02058448981c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Amoxicillin Generic Tablets",
    dosage: "250mg",
    count: "20 Tablets",
    price: 215.00,
    badge: "GENERIC",
    image: "https://images.unsplash.com/photo-1471864190281-ad5fe9ac52b1?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    name: "Amoxicillin Forte",
    dosage: "875mg",
    count: "14 Tablets",
    price: 640.00,
    badge: "FORTE",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400"
  }
];

export default function MedicationSearch() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32 bg-[#F8FAFB] min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2 mt-4">
        <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight">Find Your Medication</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[#004A8F] text-[20px]">search</span>
        </div>
        <input 
          type="text" 
          defaultValue="Amoxicillin"
          className="w-full bg-white border-none rounded-[20px] py-5 pl-14 pr-14 text-[16px] font-bold text-[#111827] shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-[#004A8F]/10 transition-all outline-none"
        />
        <div className="absolute inset-y-0 right-5 flex items-center cursor-pointer">
          <span className="material-symbols-outlined text-[#6B7280]">tune</span>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="flex flex-col gap-4 mb-10 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Popular:</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="bg-[#EBF5FA] text-[#004A8F] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Paracetamol</span>
            <span className="bg-gray-100 text-[#6B7280] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Azithromycin</span>
            <span className="bg-gray-100 text-[#6B7280] text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap">Vitamin C</span>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <p className="text-[9px] font-black text-[#004A8F] uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#004A8F] rounded-full"></span> Medications Found
          </p>
          <h2 className="text-[18px] font-extrabold text-[#111827]">6 Matches for 'Amoxicillin'</h2>
        </div>
        <button className="flex items-center gap-1.5 text-[#6B7280] text-[10px] font-bold uppercase tracking-widest hover:text-[#004A8F] transition-colors">
          <span className="material-symbols-outlined text-[16px]">sort</span> Relevance
        </button>
      </div>

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Featured Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
          <div className="w-full aspect-square bg-[#F3F4F6] rounded-[24px] mb-6 overflow-hidden flex items-center justify-center p-4">
            <img src={MEDICATIONS[0].image} alt={MEDICATIONS[0].name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div className="w-full flex justify-between items-start mb-2">
            <span className="bg-[#E6F4EA] text-[#006644] text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1">
              <span className="w-1 h-1 bg-[#006644] rounded-full"></span> Available
            </span>
            <div className="text-right">
              <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Price</p>
              <p className="text-[24px] font-black text-[#004A8F] leading-none">500.00 <span className="text-[10px] font-bold text-[#6B7280]">ETB</span></p>
            </div>
          </div>
          <h3 className="w-full text-[20px] font-extrabold text-[#111827] mb-1">{MEDICATIONS[0].name}</h3>
          <p className="w-full text-[13px] font-medium text-[#6B7280] mb-8">{MEDICATIONS[0].dosage} • {MEDICATIONS[0].count}</p>
          
          <button onClick={() => navigate('/cart')} className="w-full bg-[#004A8F] text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 mb-3 shadow-lg shadow-[#004A8F]/20 hover:bg-[#003870] transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span> Add to Cart
          </button>
          <button className="w-full bg-white text-[#111827] font-bold py-4 rounded-[16px] border border-gray-200 hover:bg-gray-50 transition-all">
            Details
          </button>
        </div>

        {/* Regular Item Cards */}
        {MEDICATIONS.slice(1).map((med) => (
          <div key={med.id} className="bg-white rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col">
            <div className="relative mb-6">
              <div className="w-full aspect-[4/3] bg-[#F3F4F6] rounded-[24px] overflow-hidden flex items-center justify-center p-4">
                <img src={med.image} alt={med.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <span className="absolute top-4 left-4 bg-gray-200/80 backdrop-blur-md text-[#4B5563] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {med.badge}
              </span>
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#6B7280] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
            </div>
            <h3 className="text-[16px] font-extrabold text-[#111827] mb-0.5">{med.name}</h3>
            <p className="text-[12px] font-medium text-[#6B7280] mb-6">{med.dosage} | {med.count}</p>
            
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Price</p>
                <p className="text-[18px] font-black text-[#111827]">{med.price.toFixed(2)} <span className="text-[9px] font-bold text-[#6B7280]">ETB</span></p>
              </div>
              <button onClick={() => navigate('/cart')} className="w-12 h-12 bg-[#F3F4F6] rounded-[14px] flex items-center justify-center text-[#004A8F] hover:bg-[#004A8F] hover:text-white transition-all shadow-sm active:scale-90">
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="bg-[#F3F4F6] text-[#111827] font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-all">
          Load More Results <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>

      {/* Floating Filter Button */}
      <button className="fixed bottom-32 right-6 w-14 h-14 bg-[#004A8F] text-white rounded-[18px] flex items-center justify-center shadow-xl z-30 hover:scale-110 transition-transform">
        <span className="material-symbols-outlined">tune</span>
      </button>

    </div>
  );
}
