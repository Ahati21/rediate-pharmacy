import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../ThemeContext';

export default function Header() {
  const { role, logout, isLoggedIn, userName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
              <button className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-outline dark:text-slate-400">notifications</span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
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
