import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../ThemeContext';
import { useNotifications } from '../../NotificationContext';

export default function Header() {
  const { role, logout, isLoggedIn, userName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Close notifications on click away
  useEffect(() => {
    if (isNotificationsOpen) {
      const handleClickAway = () => setIsNotificationsOpen(false);
      window.addEventListener('click', handleClickAway);
      return () => window.removeEventListener('click', handleClickAway);
    }
  }, [isNotificationsOpen]);

  return (
    <>
      <header className="flex justify-between items-center px-6 h-20 w-full bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant/10 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-primary dark:text-blue-400">menu</span>
          </button>
          <Link to="/" className="font-headline font-extrabold text-primary text-2xl tracking-tight dark:text-blue-400">
            Rediate Pharmacy
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {isLoggedIn && (
            <>
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-outline dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Notification Bell */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors dark:hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined text-outline dark:text-slate-400">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white dark:border-slate-900"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-700 overflow-hidden z-50">
                    <div className="p-5 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center bg-surface dark:bg-slate-800/50">
                      <h3 className="font-headline font-bold text-primary dark:text-blue-400">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => markAllAsRead()}
                          className="text-[10px] font-black uppercase tracking-widest text-[#004A8F] dark:text-blue-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <span className="material-symbols-outlined text-4xl text-outline/30 dark:text-slate-600 mb-2">notifications_off</span>
                          <p className="text-sm font-medium text-outline/60 dark:text-slate-500">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setIsNotificationsOpen(false);
                            }}
                            className={`p-5 border-b border-outline-variant/5 dark:border-slate-700/50 cursor-pointer transition-colors hover:bg-surface-container-lowest dark:hover:bg-slate-700/30 ${!n.read ? 'bg-[#F0F7FF] dark:bg-blue-900/10' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#004A8F] dark:bg-blue-400' : 'bg-transparent'}`} />
                              <div>
                                <h4 className={`text-[14px] leading-tight mb-1 ${!n.read ? 'font-black text-[#111827] dark:text-white' : 'font-bold text-[#6B7280] dark:text-slate-400'}`}>
                                  {n.title}
                                </h4>
                                <p className="text-[12px] text-[#4B5563] dark:text-slate-400 leading-snug line-clamp-2">
                                  {n.message}
                                </p>
                                <p className="text-[10px] font-bold text-[#9CA3AF] mt-2 uppercase tracking-tight">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-4 text-center bg-surface-container-lowest dark:bg-slate-900/50">
                        <button className="text-[11px] font-black uppercase text-[#6B7280] dark:text-slate-400 tracking-widest hover:text-[#004A8F] dark:hover:text-blue-400 transition-colors">
                          View Activity Log
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-right hidden md:block mr-2">
                {role !== 'pharmacist' && (
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 dark:text-slate-400">
                    {role === 'admin' ? 'Administrator' : 'Patient'}
                  </p>
                )}
                <p className="text-sm font-headline font-bold text-primary dark:text-blue-400">
                  {userName || (role === 'admin' ? 'Dr. Julian Vance' : 'Abebe Bikila')}
                </p>
              </div>

              {/* Fast Sign Out Button */}
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </>
          )}
          <div 
            onClick={() => {
              if (isLoggedIn) logout();
              navigate('/login');
            }}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold overflow-hidden border-2 border-white shadow-sm cursor-pointer active:opacity-80 transition-all flex items-center justify-center dark:bg-blue-900/20 dark:text-blue-400 dark:border-slate-800"
          >
            {isLoggedIn ? (
              <span className="uppercase text-sm">{userName ? userName.charAt(0) : 'U'}</span>
            ) : (
              <span className="material-symbols-outlined text-outline dark:text-slate-400">person</span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-headline font-bold text-primary dark:text-blue-400">Menu</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-500 dark:text-slate-400">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {role !== 'customer' ? (
              <>
                <Link 
                  to="/inventory" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">inventory_2</span>
                  Inventory
                </Link>
                <Link 
                  to="/pharmacists" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">medical_services</span>
                  Pharmacists
                </Link>
                <Link 
                  to="/admin/sales" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">bar_chart</span>
                  Sales Report
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">home</span>
                  Home
                </Link>
                <Link 
                  to="/search" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">storefront</span>
                  Pharmacy
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-blue-900/20 text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">receipt_long</span>
                  Orders
                </Link>
              </>
            )}
            
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-slate-800">
              <button 
                onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
