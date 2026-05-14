import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { Medication } from '../types';

export default function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Antibiotics',
    dosage: '',
    batchNumber: '',
    notes: '',
    stock: 100,
    price: '',
    expiryDate: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await api.post<ApiItemResponse<Medication>>('/medicines', {
        name: formData.name,
        category: formData.category,
        dosage: formData.dosage,
        batchNumber: formData.batchNumber,
        notes: formData.notes,
        stock: Number(formData.stock),
        price: Number(formData.price),
        expiryDate: formData.expiryDate,
        status: 'Pending',
        type: formData.category.toLowerCase().includes('vaccine')
          ? 'vaccines'
          : formData.category.toLowerCase().includes('syrup')
            ? 'medication_liquid'
            : 'pill',
      });

      navigate('/medicine-success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="text-on-surface-variant font-medium">
          Register new pharmaceutical arrivals into the system. Ensure all dosage and batch details are verified for clinical accuracy.
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-8" onSubmit={handleSubmit}>
          <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(24,28,30,0.02)] border border-outline-variant/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Medicine Name</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="e.g. Amoxicillin" type="text" value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Category</label>
                <select className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface appearance-none" value={formData.category} onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))}>
                  <option>Antibiotics</option>
                  <option>Analgesics</option>
                  <option>Hypertension</option>
                  <option>Vaccines</option>
                  <option>Syrups</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Dosage</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="e.g. 500mg" type="text" value={formData.dosage} onChange={(e) => setFormData((current) => ({ ...current, dosage: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Batch Number</label>
                <input className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface" placeholder="B-2024-X9" type="text" value={formData.batchNumber} onChange={(e) => setFormData((current) => ({ ...current, batchNumber: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Internal Clinical Notes</label>
              <textarea className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl px-4 py-3 focus:ring-0 transition-all font-medium text-on-surface resize-none" placeholder="Storage requirements or contraindication notes..." rows={3} value={formData.notes} onChange={(e) => setFormData((current) => ({ ...current, notes: e.target.value }))}></textarea>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[2rem] space-y-6 border border-outline-variant/10 shadow-sm">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Stock Level</label>
                <div className="flex items-center gap-4 bg-surface-container-lowest rounded-xl p-1 shadow-sm">
                  <button type="button" className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-colors text-primary" onClick={() => setFormData((current) => ({ ...current, stock: Math.max(0, current.stock - 1) }))}>
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input className="w-full bg-transparent border-none text-center font-headline text-xl font-bold focus:ring-0 text-on-surface" type="number" value={formData.stock} onChange={(e) => setFormData((current) => ({ ...current, stock: Number(e.target.value) }))} />
                  <button type="button" className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-colors text-primary" onClick={() => setFormData((current) => ({ ...current, stock: current.stock + 1 }))}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Price (ETB)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">ETB</span>
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl pl-14 pr-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all font-headline text-lg font-bold text-on-surface" placeholder="0.00" type="number" value={formData.price} onChange={(e) => setFormData((current) => ({ ...current, price: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Expiry Date</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-on-surface" type="date" value={formData.expiryDate} onChange={(e) => setFormData((current) => ({ ...current, expiryDate: e.target.value }))} required />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              {isSubmitting ? 'Adding Medicine...' : 'Add Medicine'}
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
