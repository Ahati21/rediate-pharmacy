import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiListResponse } from '../lib/api';
import { Pharmacist } from '../types';

export default function ManagePharmacists() {
  const navigate = useNavigate();
  const [pharmacists, setPharmacists] = React.useState<Pharmacist[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

    React.useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiListResponse<Pharmacist>>('/pharmacists');
        setPharmacists(response.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load pharmacists');
      } finally {
        setIsLoading(false);
      }
    };

    const activeCount = pharmacists.filter((pharmacist) => pharmacist.status === 'Approved').length;
    const pendingCount = pharmacists.filter((pharmacist) => pharmacist.status === 'Pending').length;
    const verifiedPercent = pharmacists.length ? Math.round((activeCount / pharmacists.length) * 100) : 0;

    const handleDelete = async (id: string) => {
      if (!window.confirm('Are you sure you want to remove this pharmacist? This will revoke their access immediately.')) return;
      try {
        await api.delete(`/pharmacists/${id}`);
        setPharmacists(pharmacists.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to remove pharmacist');
      }
    };

    return (
      <div className="max-w-5xl mx-auto px-6 py-8 pb-32 bg-[#F7F9FA] min-h-screen">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] md:text-4xl font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-3">
              Manage Pharmacists
            </h1>
            <p className="text-[14px] text-[#4B5563] leading-relaxed max-w-2xl">
              Monitor staff credentials, roles, and access levels for the clinical pharmaceutical division.
            </p>
          </div>

          <button
            onClick={() => navigate('/add-pharmacist')}
            className="bg-[#004A8F] text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#003870] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Pharmacist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {isLoading && (
            <div className="col-span-full rounded-[20px] bg-white p-6 text-center text-sm font-medium text-[#6B7280] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              Loading pharmacists...
            </div>
          )}
          {!isLoading && error && (
            <div className="col-span-full rounded-[20px] bg-white p-6 text-center text-sm font-medium text-red-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {error}
            </div>
          )}
          {!isLoading && !error && pharmacists.map((pharmacist) => (
            <div key={pharmacist.id} className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative flex flex-col hover:shadow-md transition-shadow group">
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigate(`/edit-pharmacist/${pharmacist.id}`)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-[#004A8F] flex items-center justify-center hover:bg-[#004A8F] hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(pharmacist.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>

              <div className="flex gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-400 shrink-0 border border-gray-200 dark:border-slate-600">
                <span className="material-symbols-outlined text-[32px]">person</span>
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-[16px] mb-1">{pharmacist.name}</h3>
                <p className="text-[13px] text-[#6B7280] mb-2">{pharmacist.role} • ID: {pharmacist.employeeId}</p>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block ${
                  pharmacist.status === 'Approved'
                    ? 'bg-[#006644] text-white'
                    : pharmacist.status === 'Pending'
                      ? 'bg-[#CBE3FA] text-[#004A8F]'
                      : 'bg-[#E1E3E5] text-[#4A545E]'
                }`}>
                  {pharmacist.status}
                </span>
              </div>
            </div>

            <div className="space-y-1 ml-[80px] mb-4">
              <p className="text-[13px] text-[#374151] truncate">{pharmacist.email}</p>
              <p className="text-[13px] text-[#374151]">{pharmacist.phone}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-12">
        <button className="text-[#004A8F] text-[14px] font-bold flex items-center justify-center gap-2 hover:underline">
          View Archival Records <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#D0E2FF] flex items-center justify-center text-[#004A8F] mb-5">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <h3 className="font-bold text-2xl text-[#111827] mb-2">{activeCount} Active</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            Qualified staff members currently on the medical rotation.
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#9EF0C6] flex items-center justify-center text-[#006644] mb-5">
            <span className="material-symbols-outlined text-[24px]">shield_person</span>
          </div>
          <h3 className="font-bold text-2xl text-[#111827] mb-2">{verifiedPercent}% Verified</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            Active staff records already confirmed in the backend system.
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#CBE3FA] flex items-center justify-center text-[#004A8F] mb-5">
            <span className="material-symbols-outlined text-[24px]">history</span>
          </div>
          <h3 className="font-bold text-2xl text-[#111827] mb-2">{pendingCount} Pending</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            Credential reviews waiting for administrative final signature.
          </p>
        </div>
      </div>
    </div>
  );
}
