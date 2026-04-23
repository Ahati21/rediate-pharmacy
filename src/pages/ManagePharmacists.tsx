import React from 'react';
import { useNavigate } from 'react-router-dom';

const PHARMACISTS = [
  {
    id: '1',
    name: 'Dr. Julian Vance',
    role: 'Senior Clinical Lead',
    employeeId: 'RX-9042',
    email: 'julian.v@rediate.com',
    phone: '+1 (555) 902-1244',
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150',
    statusColor: 'bg-[#006644] text-white'
  },
  {
    id: '2',
    name: 'Sarah Sterling',
    role: 'Inventory Specialist',
    employeeId: 'RX-8821',
    email: 's.sterling@rediate.com',
    phone: '+1 (555) 433-8812',
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1594824432258-2bb1f13b6329?auto=format&fit=crop&q=80&w=150',
    statusColor: 'bg-[#006644] text-white'
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    role: 'Night Pharmacist',
    employeeId: 'RX-9102',
    email: 'm.thorne@rediate.com',
    phone: '+1 (555) 221-0034',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
    statusColor: 'bg-[#CBE3FA] text-[#004A8F]'
  },
  {
    id: '4',
    name: 'Elena Rodriguez',
    role: 'Clinical Technician',
    employeeId: 'RX-7742',
    email: 'elena.r@rediate.com',
    phone: '+1 (555) 867-1123',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    statusColor: 'bg-[#E1E3E5] text-[#4A545E]'
  }
];

export default function ManagePharmacists() {
  const navigate = useNavigate();

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
        {PHARMACISTS.map((p) => (
          <div key={p.id} className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative flex flex-col hover:shadow-md transition-shadow">
            <div className="flex gap-4 mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={p.avatar} alt={p.name} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-[16px] mb-1">{p.name}</h3>
                <p className="text-[13px] text-[#6B7280] mb-2">{p.role} • ID: {p.employeeId}</p>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 ml-[80px] mb-4">
              <p className="text-[13px] text-[#374151] truncate">{p.email}</p>
              <p className="text-[13px] text-[#374151]">{p.phone}</p>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-3 mt-auto">
              <button className="text-[#4B5563] hover:text-[#111827] transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button className="text-[#DC2626] hover:text-[#991B1B] transition-colors">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
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
          <h3 className="font-bold text-2xl text-[#111827] mb-2">24 Active</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            Qualified staff members currently on the medical rotation.
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#9EF0C6] flex items-center justify-center text-[#006644] mb-5">
            <span className="material-symbols-outlined text-[24px]">shield_person</span>
          </div>
          <h3 className="font-bold text-2xl text-[#111827] mb-2">100% Verified</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            All personnel have completed the quarterly compliance audit.
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#CBE3FA] flex items-center justify-center text-[#004A8F] mb-5">
            <span className="material-symbols-outlined text-[24px]">history</span>
          </div>
          <h3 className="font-bold text-2xl text-[#111827] mb-2">2 Pending</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            Credential reviews waiting for administrative final signature.
          </p>
        </div>
      </div>
    </div>
  );
}
