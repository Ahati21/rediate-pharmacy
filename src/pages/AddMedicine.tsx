import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddMedicine() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-32 md:pb-12">
      <header className="mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Stock
        </button>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Add New Medicine</h2>
        <p className="text-on-surface-variant font-medium">Register new pharmaceutical arrivals into the system. Ensure all dosage and batch details are verified for clinical accuracy.</p>
      </header>

      <div className="max-w-6xl mx-auto">

        <form className="grid grid-cols-1 md:grid-cols-12 gap-8" onSubmit={(e) => { e.preventDefault(); navigate('/medicine-success'); }}>
          <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(24,28,30,0.02)] border border-outline-variant/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Medicine Name</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="e.g. Amoxicillin" type="text" required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Category</label>
                <select className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface appearance-none">
                  <option>Select Category</option>
                  <option>Antibiotics</option>
                  <option>Analgesics</option>
                  <option>Hypertension</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Dosage</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="e.g. 500mg" type="text" required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Batch Number</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="B-2024-X9" type="text" required />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Internal Clinical Notes</label>
              <textarea className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface resize-none" placeholder="Storage requirements or contraindication notes..." rows={3}></textarea>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[2rem] space-y-6 border border-outline-variant/10 shadow-sm">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Stock Level</label>
                <div className="flex items-center gap-4 bg-surface-container-lowest rounded-xl p-1 shadow-sm">
                  <button type="button" className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-colors text-primary">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input className="w-full bg-transparent border-none text-center font-headline text-xl font-bold focus:ring-0 text-on-surface" type="number" defaultValue={100} />
                  <button type="button" className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-colors text-primary">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Price (ETB)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">ETB</span>
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl pl-14 pr-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all font-headline text-lg font-bold text-on-surface" placeholder="0.00" type="number" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Expiry Date</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-on-surface" type="date" required />
              </div>
            </div>

            <button type="submit" className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Add Medicine
            </button>
            <p className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant mt-4 font-bold opacity-60 font-label">Verification will be logged by Admin User</p>
          </div>
        </form>

        <div className="mt-12 relative overflow-hidden rounded-2xl h-48 bg-tertiary-container group shadow-lg">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXyvsFQBT_j4q0OxtrQ0XS5i99VU4tHhzy5ZO67T8Eh0QrHKUIJ9n2uAbVgmI4Zo-pWwnhYcJjGIpON3gPnav1cxH0AT8RjpdiC3ltgT5rfHPHKDho9MiRM-iPJKnZ5dzrov5LqtkDmzceayIewZA6ZG1Z4ipI5ZWrXXZHGl2btd11XfAOb3zNjNUkOP8o3rf9qyQzWL_nLZ88FL3SdQ4uzd6-Op4cxEKsl_7izsujafMeE6DV5__91VW9c_EAMezSEd2xI_3mgME" 
            alt="Clinical Ethics"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <div className="flex items-center gap-2 mb-2 text-tertiary-fixed font-label text-xs uppercase font-bold tracking-tighter">
              <span className="material-symbols-outlined">verified_user</span>
              Quality Protocol
            </div>
            <h3 className="font-headline text-xl font-bold text-white">Ethos Clinical Integrity</h3>
            <p className="text-tertiary-fixed/80 text-sm max-w-sm font-medium">Every entry is cross-referenced with the national medical inventory database to ensure patient safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
