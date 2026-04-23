import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { MOCK_MEDICATIONS } from '../constants';
import { useAuth } from '../AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-32 md:pb-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 block font-label dark:text-slate-400">System Overview</span>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight dark:text-white">Administrative Control</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/pharmacists')}
            className="bg-surface-container-low text-primary font-headline font-bold px-6 py-3 rounded-xl hover:bg-surface-container-high transition-all flex items-center gap-2 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
          >
            <span className="material-symbols-outlined">group</span>
            Manage Pharmacists
          </button>
          <button 
            onClick={() => navigate('/add-medicine')}
            className="bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:saturate-150 transition-all flex items-center gap-2 dark:from-blue-600 dark:to-blue-400"
          >
            <span className="material-symbols-outlined">add</span>
            Add Medicine
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="md:col-span-2 bg-surface-container-low dark:bg-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group border border-outline-variant/10 dark:border-slate-700 shadow-sm">
          <div className="z-10">
            <p className="text-on-surface-variant dark:text-slate-400 font-medium tracking-wide mb-1">Total Inventory Assets</p>
            <h3 className="text-6xl font-headline font-extrabold text-primary dark:text-blue-400 mb-2">1,240</h3>
            <p className="text-tertiary dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +4% from last month
            </p>
          </div>
          <span className="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[180px] opacity-10 dark:opacity-5 text-primary dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
            medication
          </span>
        </div>

        <div className="bg-error-container dark:bg-red-900/30 p-8 rounded-[2.5rem] flex flex-col justify-between border border-error/10 dark:border-red-900/50">
          <div>
            <p className="text-on-error-container dark:text-red-400 font-bold tracking-tight mb-1 opacity-70">Out of Stock</p>
            <h3 className="text-5xl font-headline font-extrabold text-on-error-container dark:text-red-400 tracking-tighter">12</h3>
          </div>
          <div className="flex items-center gap-2 text-on-error-container dark:text-red-400 font-medium text-sm">
            <span className="material-symbols-outlined text-error">warning</span>
            Requires Action
          </div>
        </div>

        <div className="bg-secondary-container dark:bg-blue-900/30 p-8 rounded-[2.5rem] flex flex-col justify-between border border-secondary/10 dark:border-blue-900/50">
          <div>
            <p className="text-on-secondary-fixed-variant dark:text-blue-400 font-bold tracking-tight mb-1 opacity-70">Active Pharmacists</p>
            <h3 className="text-5xl font-headline font-extrabold text-on-secondary-fixed-variant dark:text-blue-400 tracking-tighter">08</h3>
          </div>
          <div className="flex items-center gap-2 text-on-secondary-fixed-variant dark:text-blue-400 font-medium text-sm">
            <span className="material-symbols-outlined">verified_user</span>
            All shifts covered
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-headline font-bold text-on-surface dark:text-white">Critical Stock Alerts</h3>
            <button className="text-primary dark:text-blue-400 font-bold text-sm hover:underline">View all reports</button>
          </div>
          <div className="space-y-4">
            {MOCK_MEDICATIONS.filter(m => m.status !== 'Approved').map((m) => (
              <div key={m.id} className="bg-surface-container-lowest dark:bg-slate-800/50 p-6 rounded-full flex items-center justify-between group hover:bg-surface-container dark:hover:bg-slate-800 transition-colors cursor-pointer border border-outline-variant/30 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", m.status === 'Low Stock' ? "bg-error-container dark:bg-red-900/30 text-error dark:text-red-400" : "bg-secondary-container dark:bg-blue-900/30 text-secondary dark:text-blue-400")}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface dark:text-white">{m.name} {m.dosage}</h4>
                    <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">Batch {m.batchNumber} • {m.stock} units left</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("hidden sm:inline text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full", m.status === 'Low Stock' ? "bg-error-container dark:bg-red-900/30 text-on-error-container dark:text-red-400" : "bg-secondary-container dark:bg-blue-900/30 text-on-secondary-container dark:text-blue-400")}>
                    {m.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-500 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-container-high dark:bg-slate-800 rounded-[2.5rem] p-8 border border-outline-variant/10 dark:border-slate-700 shadow-sm">
            <h3 className="font-headline font-bold text-on-surface dark:text-white mb-6">Pharmacy Performance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Daily Orders Fill Rate</span>
                  <span className="text-sm font-headline font-bold text-primary dark:text-blue-400">94%</span>
                </div>
                <div className="w-full bg-surface-container-lowest dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary dark:bg-blue-500 h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Dispensing Speed</span>
                  <span className="text-sm font-headline font-bold text-tertiary dark:text-emerald-400">Fast (8.2m)</span>
                </div>
                <div className="w-full bg-surface-container-lowest dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary dark:bg-emerald-500 h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-[2.5rem] overflow-hidden h-[300px] flex flex-col justify-end p-8 group cursor-pointer shadow-lg">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800" 
              alt="Security Protocol"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="relative z-10 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-80">Security Protocol</p>
              <h4 className="text-xl font-headline font-bold mb-4">Storage Zone 4 Secure</h4>
              <button className="bg-white/20 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-full border border-white/30 hover:bg-white/40 transition-all">Review Access Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
