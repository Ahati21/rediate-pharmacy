import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl px-4"
      >
        <div className="absolute inset-0 bg-surface-container-low rounded-[2rem] transform translate-x-3 translate-y-3"></div>
        
        <div className="relative bg-surface-container-lowest rounded-[2rem] p-8 md:p-16 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(24,28,30,0.05)]">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-tertiary-container/10 scale-150 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-tertiary-container flex items-center justify-center rounded-full shadow-lg">
              <span className="material-symbols-outlined text-white text-5xl md:text-7xl font-bold" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
                check_circle
              </span>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <span className="inline-block px-4 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold tracking-widest uppercase rounded-full">
              Account Confirmed
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight font-headline">
              Registration Successful!
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
              You can now log in to access your pharmacy portal.
            </p>
          </div>

          <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl text-left flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">medication</span>
              <div>
                <p className="text-sm font-bold text-on-surface uppercase tracking-wider mb-1">Medication Tracking</p>
                <p className="text-xs text-on-surface-variant leading-normal">Monitor your scripts and renewal cycles in real-time.</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl text-left flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">local_shipping</span>
              <div>
                <p className="text-sm font-bold text-on-surface uppercase tracking-wider mb-1">Direct Delivery</p>
                <p className="text-xs text-on-surface-variant leading-normal">Schedule discreet door-to-door deliveries with ease.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full flex flex-col items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Return to Login
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <p className="text-sm text-on-surface-variant">
              Need assistance? <button className="text-primary font-bold hover:underline">Contact Support</button>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
