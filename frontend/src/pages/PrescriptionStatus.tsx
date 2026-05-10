import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function PrescriptionStatus() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] p-10 md:p-16 text-center shadow-[0_30px_80px_rgba(24,28,30,0.05)] border border-outline-variant/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[180px]">prescriptions</span>
        </div>

        <div className="relative">
          <div className="mb-10 inline-flex relative">
            <div className="absolute inset-0 bg-tertiary-container/20 rounded-full scale-150 blur-3xl animate-pulse"></div>
            <div className="w-28 h-28 bg-tertiary text-white flex items-center justify-center rounded-[2.5rem] shadow-xl relative animate-bounce-slow">
              <span className="material-symbols-outlined text-6xl">verified</span>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <span className="inline-block px-4 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-black tracking-[0.25em] uppercase rounded-full">Automated Registry Sync Complete</span>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface tracking-tight">Prescription Approved!</h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-sm mx-auto">Your clinical script has been verified by the onboarded pharmacist. You may now proceed to checkout.</p>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-8 mb-10 text-left border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Approval ID</p>
              <p className="font-headline font-bold text-on-surface">#AUTH-990-RX</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Pharmacist</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-tertiary rounded-full"></span>
                <p className="font-headline font-bold text-on-surface">Verified Clinical Lead</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button 
              onClick={() => navigate('/cart')}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-headline font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Secure Checkout
              <span className="material-symbols-outlined">payments</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-10 py-5 bg-surface-container-high text-on-surface font-headline font-bold rounded-2xl hover:bg-surface-dim transition-all"
            >
              Return Home
            </button>
          </div>
          
          <p className="mt-8 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Verified in Addis Ababa Central Hub</p>
        </div>
      </motion.div>
    </div>
  );
}
