import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotifications } from '../NotificationContext';
import { api, ApiListResponse, resolveAssetUrl } from '../lib/api';
import { Prescription, Order } from '../types';

export default function PharmacistQueue() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Close notifications on click away
  useEffect(() => {
    if (isNotificationsOpen) {
      const handleClickAway = () => setIsNotificationsOpen(false);
      window.addEventListener('click', handleClickAway);
      return () => window.removeEventListener('click', handleClickAway);
    }
  }, [isNotificationsOpen]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prescRes, orderRes, confirmedRes] = await Promise.all([
        api.get<ApiListResponse<Prescription>>('/prescriptions?status=pending'),
        api.get<ApiListResponse<Order>>('/orders?status=pending'),
        api.get<ApiListResponse<Order>>('/orders?status=confirmed')
      ]);
      setPrescriptions(prescRes.data);
      setOrders([...orderRes.data, ...confirmedRes.data]);
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle hash-based scrolling (e.g. #payments)
  useEffect(() => {
    if (location.hash === '#payments' && !isLoading) {
      setTimeout(() => {
        const el = document.getElementById('payments');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, isLoading]);

  const handleConfirmPayment = async (orderId: string) => {
    try {
      setIsProcessing(orderId);
      await api.patch(`/orders/${orderId}/status`, { 
        status: 'verified',
        note: 'Payment verified by pharmacist'
      });
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      alert('Failed to confirm payment');
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const periodButtonClass = (buttonPeriod: string) =>
    `px-8 py-2.5 text-[12px] font-bold rounded-[10px] transition-all duration-300 ${
      true // Defaulting to true for visual consistency in the old style
        ? 'text-[#004A8F] dark:text-blue-400 bg-white dark:bg-slate-700 shadow-md transform scale-105'
        : 'text-[#4A545E] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
    }`;

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center bg-[#F7F9FA] dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#004A8F]/20 rounded-full mb-4"></div>
          <p className="text-gray-500 font-bold">Loading clinical queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#F7F9FA] dark:bg-slate-900 min-h-screen font-sans pb-32">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button className="p-1">
             <span className="material-symbols-outlined text-[#111827] dark:text-white">menu</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-[16px] font-black text-[#004A8F] dark:text-blue-400 leading-tight">Rediate</h1>
            <h1 className="text-[16px] font-black text-[#004A8F] dark:text-blue-400 leading-tight">Pharmacy</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
             <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
               className="relative p-1 flex items-center justify-center"
             >
               <span className={`material-symbols-outlined ${unreadCount > 0 ? 'text-red-600' : 'text-[#004A8F] dark:text-blue-400'}`}>notifications</span>
               {unreadCount > 0 && (
                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
               )}
             </button>

             {/* Notifications Dropdown */}
             {isNotificationsOpen && (
               <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                 <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                   <h3 className="text-sm font-black text-[#004A8F] dark:text-blue-400">Notifications</h3>
                   {unreadCount > 0 && (
                     <button 
                       onClick={() => markAllAsRead()}
                       className="text-[10px] font-black uppercase text-[#6B7280] dark:text-slate-400 hover:underline"
                     >
                       Clear All
                     </button>
                   )}
                 </div>
                 <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                   {notifications.length === 0 ? (
                     <div className="p-6 text-center text-gray-400 text-xs italic">No new messages</div>
                   ) : (
                     notifications.map((n) => (
                       <div 
                         key={n.id}
                         onClick={() => {
                           markAsRead(n.id);
                           if (n.link) navigate(n.link);
                           setIsNotificationsOpen(false);
                         }}
                         className={`p-4 border-b border-gray-50 dark:border-slate-700/50 cursor-pointer ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                       >
                         <h4 className={`text-[13px] mb-1 ${!n.read ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-500 dark:text-slate-400'}`}>
                           {n.title}
                         </h4>
                         <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 leading-tight">
                           {n.message}
                         </p>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             )}
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}>
            <span className="material-symbols-outlined text-[#6B7280]">logout</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-400 border-2 border-white dark:border-slate-800 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>
      </header>

      <div className="px-5 py-6">
        {/* 1. New Prescription Notification */}
        {prescriptions.length > 0 && (
          <div className="bg-[#4186B1] rounded-[24px] p-6 text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[24px]">notifications_active</span>
              </div>
              <div>
                <h3 className="text-[18px] font-black tracking-tight">New Prescription Uploaded</h3>
                <p className="text-white/80 text-[13px] font-medium">Patient: <span className="text-white font-black">{prescriptions[0].patientName}</span> • Just now</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/pharmacist/review/${prescriptions[0].id}`)}
              className="w-full bg-white text-[#4186B1] font-black py-3 rounded-xl text-[14px] shadow-sm hover:bg-gray-50 transition-colors"
            >
              Review Now
            </button>
          </div>
        )}

        <div className="mb-10">
          <p className="text-[12px] font-black text-[#004A8F] dark:text-blue-400 uppercase tracking-widest mb-3">Search Clinical Registry</p>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search patient, order #, or doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 rounded-[16px] py-4 pl-12 pr-4 text-[14px] text-gray-900 dark:text-white outline-none shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 dark:border-slate-700"
            />
          </div>
        </div>

        {/* 3. Pending Prescriptions Section */}
        <div className="flex items-end justify-between mb-6">
           <div>
             <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Clinical Queue</p>
             <h2 className="text-[28px] font-black text-[#111827] dark:text-white tracking-tight">Pending Prescriptions</h2>
           </div>
           <button className="text-[12px] font-black text-[#004A8F] dark:text-blue-400 hover:underline">View All Queue</button>
        </div>

        <div className="space-y-6 mb-12">
          {filteredPrescriptions.length === 0 ? (
            <p className="text-center text-gray-400 py-10 italic text-sm">No matching prescriptions</p>
          ) : (
            filteredPrescriptions.map((p, idx) => (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-md border border-gray-50 dark:border-slate-700">
                 <div className="h-[200px] bg-gray-100 dark:bg-slate-700 relative overflow-hidden">
                   {p.fileUrl ? (
                     <img src={resolveAssetUrl(p.fileUrl)} className="w-full h-full object-cover" alt="Prescription" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-300 text-6xl">prescriptions</span>
                     </div>
                   )}
                 </div>
                 <div className="p-6">
                   <div className="flex justify-between items-start mb-1">
                     <h3 className="text-[20px] font-black text-[#111827] dark:text-white">{p.doctorName}</h3>
                     <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${idx === 0 ? 'bg-[#D1E9F6] text-[#004A8F]' : 'bg-gray-100 text-[#6B7280]'}`}>
                       {idx === 0 ? 'URGENT' : 'ROUTINE'}
                     </span>
                   </div>
                   <p className="text-[13px] text-[#6B7280] dark:text-slate-400 font-medium mb-6">Patient: {p.patientName}</p>
                   <button 
                     onClick={() => navigate(`/pharmacist/review/${p.id}`)}
                     className="w-full bg-[#004A8F] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#003870] transition-colors shadow-lg shadow-blue-100 dark:shadow-none"
                   >
                     <span className="material-symbols-outlined text-[20px]">visibility</span>
                     Review
                   </button>
                 </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Payment Reconciliation Section */}
        <div id="payments" className="bg-[#F2F4F5] dark:bg-slate-800/50 rounded-[40px] p-8 mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-[#004A8F] rounded-[16px] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div>
              <h3 className="text-[18px] font-black text-[#111827] dark:text-white leading-tight">Payment Reconciliation</h3>
              <p className="text-[12px] text-[#6B7280] dark:text-slate-400 font-medium">Confirm bank/mobile transfers</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-400 py-6 italic text-sm font-medium">No matching payments</p>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="bg-white dark:bg-slate-800 rounded-[20px] p-5 shadow-sm border-l-4 border-[#004A8F]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest mb-1">{o.paymentMethod === 'Chapa Pay' ? 'CHAPA DIGITAL' : 'MANUAL TRANSFER'}</p>
                      <p className="text-[15px] font-black text-[#111827] dark:text-white">Order #{o.orderNumber.slice(-4)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-[#004A8F] dark:text-blue-400 uppercase tracking-widest mb-0.5">ETB</p>
                      <p className="text-[16px] font-black text-[#004A8F] dark:text-blue-400 leading-none">{o.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {o.transactionRef && (
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-2 mb-4 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Ref: {o.transactionRef}</span>
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">verified_user</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-slate-700/50">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${o.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {o.status === 'confirmed' ? 'Paid (Verified)' : 'Awaiting Pay'}
                    </span>
                    <button 
                      onClick={() => handleConfirmPayment(o.id)}
                      disabled={isProcessing === o.id}
                      className="text-[11px] font-black text-[#004A8F] dark:text-blue-400 uppercase tracking-tighter hover:underline disabled:opacity-50"
                    >
                      {isProcessing === o.id ? 'Processing...' : (
                        <>Confirm<br/>Payment</>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 py-4 px-6 flex justify-around items-center z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => navigate('/pharmacist/queue')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all ${location.pathname === '/pharmacist/queue' && !location.hash.includes('payments') ? 'bg-[#D1E9F6] text-[#004A8F]' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined font-bold">fact_check</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Review</span>
        </button>
        <button 
          onClick={() => navigate('/inventory')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all ${location.pathname === '/inventory' ? 'bg-[#D1E9F6] text-[#004A8F]' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined font-bold">inventory_2</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Stock</span>
        </button>
        <button 
          onClick={() => navigate('/pharmacist/queue#payments')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all ${location.hash.includes('payments') ? 'bg-[#D1E9F6] text-[#004A8F]' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined font-bold">payments</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Pay</span>
        </button>
      </nav>
    </div>
  );
}
