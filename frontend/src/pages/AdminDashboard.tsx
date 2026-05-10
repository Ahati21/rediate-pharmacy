import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api, ApiItemResponse } from '../lib/api';
import { DashboardStats } from '../types';
import { useAuth } from '../AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<DashboardStats>>('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    }

    void fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-on-surface-variant font-bold">Synchronizing administrative data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="bg-error-container p-8 rounded-3xl border border-error/20 inline-block">
          <span className="material-symbols-outlined text-error text-4xl mb-4">error</span>
          <h3 className="text-xl font-bold text-on-error-container mb-2">System Error</h3>
          <p className="text-on-error-container/80 mb-6">{error || 'Could not retrieve statistics'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-error text-white px-6 py-2 rounded-xl font-bold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-on-surface-variant dark:text-slate-400 font-medium tracking-wide mb-1">Inventory Assets (Total SKUs)</p>
            <h3 className="text-6xl font-headline font-extrabold text-primary dark:text-blue-400 mb-2">{stats.inventory.total}</h3>
            <p className="text-tertiary dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">payments</span>
              ETB {stats.revenue.total.toLocaleString()} Revenue
            </p>
          </div>
          <span className="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[180px] opacity-10 dark:opacity-5 text-primary dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
            medication
          </span>
        </div>

        <div className="bg-error-container dark:bg-red-900/30 p-8 rounded-[2.5rem] flex flex-col justify-between border border-error/10 dark:border-red-900/50">
          <div>
            <p className="text-on-error-container dark:text-red-400 font-bold tracking-tight mb-1 opacity-70">Low Stock Alert</p>
            <h3 className="text-5xl font-headline font-extrabold text-on-error-container dark:text-red-400 tracking-tighter">{stats.inventory.lowStock}</h3>
          </div>
          <div className="flex items-center gap-2 text-on-error-container dark:text-red-400 font-medium text-sm">
            <span className="material-symbols-outlined text-error">warning</span>
            Requires Refill
          </div>
        </div>

        <div className="bg-secondary-container dark:bg-blue-900/30 p-8 rounded-[2.5rem] flex flex-col justify-between border border-secondary/10 dark:border-blue-900/50">
          <div>
            <p className="text-on-secondary-fixed-variant dark:text-blue-400 font-bold tracking-tight mb-1 opacity-70">Pending Orders</p>
            <h3 className="text-5xl font-headline font-extrabold text-on-secondary-fixed-variant dark:text-blue-400 tracking-tighter">{stats.orders.pending}</h3>
          </div>
          <div className="flex items-center gap-2 text-on-secondary-fixed-variant dark:text-blue-400 font-medium text-sm">
            <span className="material-symbols-outlined">shopping_cart</span>
            Waiting verification
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-headline font-bold text-on-surface dark:text-white">Recent Orders</h3>
            <button className="text-primary dark:text-blue-400 font-bold text-sm hover:underline">View all orders</button>
          </div>
          <div className="space-y-4">
            {stats.orders.recent.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-3xl text-center text-on-surface-variant font-medium border border-outline-variant/30 italic">
                No orders processed yet today.
              </div>
            ) : (
              stats.orders.recent.map((order) => (
                <div key={order.id} className="bg-surface-container-lowest dark:bg-slate-800/50 p-6 rounded-3xl flex items-center justify-between group hover:bg-surface-container dark:hover:bg-slate-800 transition-colors cursor-pointer border border-outline-variant/30 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      order.status === 'pending' ? "bg-amber-100 text-amber-700" : 
                      order.status === 'delivered' ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {order.status === 'delivered' ? 'check_circle' : 'receipt_long'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-on-surface dark:text-white">{order.customerName}</h4>
                      <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">
                        Order {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-black text-on-surface dark:text-white">ETB {order.totalAmount.toFixed(2)}</p>
                      <span className={cn(
                        "text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        order.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        order.status === 'delivered' ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-500 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-container-high dark:bg-slate-800 rounded-[2.5rem] p-8 border border-outline-variant/10 dark:border-slate-700 shadow-sm">
            <h3 className="font-headline font-bold text-on-surface dark:text-white mb-6">Staff & Infrastructure</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  <span className="text-sm font-bold text-on-surface dark:text-white">Pharmacists</span>
                </div>
                <span className="text-xl font-black text-primary">{stats.pharmacists.total}</span>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Expiring Soon (Medicines)</span>
                  <span className="text-sm font-headline font-bold text-error dark:text-red-400">{stats.inventory.expiring} items</span>
                </div>
                <div className="w-full bg-surface-container-lowest dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-error h-full rounded-full" 
                    style={{ width: `${Math.min(100, (stats.inventory.expiring / stats.inventory.total) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#004A8F] to-[#00284D] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-blue-200 uppercase text-[10px] font-black tracking-widest">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                System Health
              </div>
              <h4 className="text-2xl font-headline font-bold mb-2">Database Sync Active</h4>
              <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">Local MongoDB is currently synchronized with the cloud backup service.</p>
              <button 
                onClick={() => navigate('/inventory')}
                className="w-full bg-white text-[#004A8F] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Go to Inventory
              </button>
            </div>
            <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[150px] opacity-10" style={{ fontVariationSettings: "'FILL' 1" }}>
              database
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
