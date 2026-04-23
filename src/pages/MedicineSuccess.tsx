import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function MedicineSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-surface-container-lowest border border-outline-variant/10 rounded-[3rem] p-12 text-center shadow-[0_20px_60px_rgba(24,28,30,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-[120px]">medication</span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-tertiary rounded-[2rem] text-white mb-8 shadow-lg shadow-tertiary/20">
            <span className="material-symbols-outlined text-5xl">inventory_2</span>
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">Medicine Added Successfully</h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-sm mx-auto">
              Inventory system has been updated. The medication is now listed in the catalog and available for dispensing.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 mb-10 border border-outline-variant/30 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Reference ID</span>
              <span className="font-mono text-primary font-bold">#RX-2024-M08</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Registry Date</span>
              <span className="text-on-surface font-semibold">Apr 22, 2024 • 14:04</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/add-medicine')}
              className="flex-1 py-4 px-6 bg-surface-container-high text-primary font-headline font-bold rounded-xl hover:bg-surface-dim transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Another
            </button>
            <button 
              onClick={() => navigate('/inventory')}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Back to Inventory
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
