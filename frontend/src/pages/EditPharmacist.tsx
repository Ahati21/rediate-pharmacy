import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { Pharmacist } from '../types';

export default function EditPharmacist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    role: 'General Clinical Pharmacy',
    email: '',
    phone: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPharmacist() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<Pharmacist>>(`/pharmacists/${id}`);
        const p = response.data;
        setFormData({
          name: p.name,
          employeeId: p.employeeId,
          role: p.role,
          email: p.email,
          phone: p.phone,
          status: p.status,
        });
      } catch (err) {
        setError('Failed to load pharmacist details');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchPharmacist();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await api.patch<ApiItemResponse<Pharmacist>>(`/pharmacists/${id}`, formData);
      navigate('/pharmacists');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update pharmacist');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 font-bold animate-pulse">Loading staff records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-[#F8FAFB] dark:bg-slate-900 min-h-screen font-sans pb-32">
      <div className="flex items-center justify-between px-6 py-6 bg-white dark:bg-slate-800 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-700">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-[#004A8F] dark:text-blue-400">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-[18px] font-black text-[#004A8F] dark:text-blue-400 leading-tight">Edit Staff Profile</h1>
        </div>
      </div>

      <div className="px-6 py-10 max-w-2xl mx-auto">
        <form className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-xl border border-gray-50 dark:border-slate-700 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(c => ({ ...c, name: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white" required />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Employee ID</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData(c => ({ ...c, employeeId: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white" required />
              </div>
              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData(c => ({ ...c, status: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white appearance-none">
                  <option value="Approved">Approved / Active</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Specialization</label>
              <select value={formData.role} onChange={(e) => setFormData(c => ({ ...c, role: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white appearance-none">
                <option>General Clinical Pharmacy</option>
                <option>Oncology Specialist</option>
                <option>Pediatric Specialist</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData(c => ({ ...c, email: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white" required />
              </div>
              <div>
                <label className="text-[11px] font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData(c => ({ ...c, phone: e.target.value }))} className="w-full bg-[#F3F4F6] dark:bg-slate-900 border-none rounded-[20px] px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-white" required />
              </div>
            </div>
          </div>

          <div className="pt-6">
            {error && <p className="mb-4 text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#004A8F] text-white font-black py-5 rounded-[24px] shadow-lg hover:bg-[#003870] transition-all">
              {isSubmitting ? 'Saving...' : 'Update Staff Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
