import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { Pharmacist } from '../types';

export default function AddPharmacist() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    employeeId: '',
    role: 'General Clinical Pharmacy',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');
      await api.post<ApiItemResponse<Pharmacist>>('/pharmacists', {
        name: formData.name,
        employeeId: formData.employeeId,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: 'Pending',
      });
      navigate('/pharmacist-success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create pharmacist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-[#F8FAFB] dark:bg-slate-900 min-h-screen font-sans pb-32">
      <div className="flex items-center justify-between px-6 py-6 bg-white dark:bg-slate-800 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-700">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F] dark:text-blue-400">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-[18px] font-black text-[#004A8F] dark:text-blue-400 leading-tight">Add New Pharmacist</h1>
        </div>
        <button onClick={() => navigate('/pharmacists')} className="text-[12px] font-bold text-[#004A8F] dark:text-blue-400 hover:underline mr-4">
          Back to Staff List
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-400 border-2 border-white dark:border-slate-600 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
      </div>

      <div className="px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-10 shadow-sm border border-gray-50 dark:border-slate-700">
              <div className="w-16 h-16 bg-[#E6F0ED] dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-[#006644] dark:text-emerald-400 mb-8">
                <span className="material-symbols-outlined text-[40px]">person_add</span>
              </div>
              <h2 className="text-[32px] font-black text-[#111827] dark:text-white mb-4 leading-tight">New Professional Entry</h2>
              <p className="text-[16px] text-[#4B5563] dark:text-slate-400 font-medium leading-relaxed mb-10">
                Enrolling a new pharmacist grants them access to the clinical curation suite. Ensure all license details are verified against the national database before account activation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 text-[#006644] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                  <span className="material-symbols-outlined text-[24px] font-bold">check_circle</span>
                  <span className="text-[14px] font-black">Verified License</span>
                </div>
                <div className="flex items-center gap-4 text-[#004A8F] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
                  <span className="material-symbols-outlined text-[24px] font-bold">shield</span>
                  <span className="text-[14px] font-black">Secure Profile</span>
                </div>
              </div>
            </div>

          </div>

          <form className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-xl border border-gray-50 dark:border-slate-700 space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-[2px] bg-blue-100 dark:bg-blue-900"></div>
                <span className="text-[12px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-[0.25em]">Primary Identity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                  <input type="text" placeholder="e.g. Dr. Julianne Thorne" value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all" required />
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Employee ID</label>
                  <input type="text" placeholder="RX-0000" value={formData.employeeId} onChange={(e) => setFormData((current) => ({ ...current, employeeId: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all" required />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Specialization</label>
                <select className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all appearance-none" value={formData.role} onChange={(e) => setFormData((current) => ({ ...current, role: e.target.value }))}>
                  <option>General Clinical Pharmacy</option>
                  <option>Oncology Specialist</option>
                  <option>Pediatric Specialist</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-[2px] bg-blue-100 dark:bg-blue-900"></div>
                <span className="text-[12px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-[0.25em]">Connectivity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Email Address</label>
                  <input type="email" placeholder="j.thorne@rediate.com" value={formData.email} onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all" required />
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData((current) => ({ ...current, phone: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all" required />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Temporary Password</label>
                <input type="password" placeholder="Set pharmacist login password" value={formData.password} onChange={(e) => setFormData((current) => ({ ...current, password: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white focus:ring-2 focus:ring-[#004A8F] transition-all" required minLength={8} />
              </div>
            </div>

            <div className="pt-6">
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl shadow-[#004A8F]/30 hover:bg-[#003870] active:scale-[0.98] transition-all mb-6">
                {isSubmitting ? 'Creating Account...' : 'Create Professional Account'}
                <span className="material-symbols-outlined text-[22px]">chevron_right</span>
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
                <span className="material-symbols-outlined text-[#004A8F] dark:text-blue-400 text-[20px]">info</span>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400 font-medium leading-relaxed">
                  The pharmacist will receive a login account with the email and temporary password entered above.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex justify-around items-center py-4 px-6 z-50 lg:hidden">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-slate-400">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#F3F4F6] dark:bg-blue-900/20 text-[#004A8F] dark:text-blue-400 px-6 py-2 rounded-xl">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-black uppercase">Staff</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </button>
      </div>
    </div>
  );
}
