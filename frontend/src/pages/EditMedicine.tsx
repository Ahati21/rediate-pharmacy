import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiItemResponse } from '../lib/api';
import { Medication } from '../types';

export default function EditMedicine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Antibiotics',
    dosage: '',
    batchNumber: '',
    notes: '',
    stock: 0,
    price: '',
    expiryDate: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMedicine() {
      try {
        setIsLoading(true);
        const response = await api.get<ApiItemResponse<Medication>>(`/medicines/${id}`);
        const med = response.data;
        setFormData({
          name: med.name,
          category: med.category,
          dosage: med.dosage,
          batchNumber: med.batchNumber,
          notes: med.notes || '',
          stock: med.stock,
          price: String(med.price),
          expiryDate: new Date(med.expiryDate).toISOString().split('T')[0],
        });
      } catch (err) {
        setError('Failed to load medication details');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchMedicine();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await api.patch<ApiItemResponse<Medication>>(`/medicines/${id}`, {
        name: formData.name,
        category: formData.category,
        dosage: formData.dosage,
        batchNumber: formData.batchNumber,
        notes: formData.notes,
        stock: Number(formData.stock),
        price: Number(formData.price),
        expiryDate: formData.expiryDate,
      });

      navigate('/inventory');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 font-bold animate-pulse">Loading medication data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-32 md:pb-12">
      <header className="mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Cancel Edits
        </button>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Edit Medication</h2>
        <p className="text-on-surface-variant font-medium">Update clinical details, pricing, or stock levels for this pharmaceutical record.</p>
      </header>

      <div className="max-w-6xl mx-auto">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-8" onSubmit={handleSubmit}>
          <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Medicine Name</label>
                <input className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium text-on-surface outline-none border-2 border-transparent focus:border-primary transition-all" type="text" value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                <select className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium text-on-surface outline-none border-2 border-transparent focus:border-primary transition-all" value={formData.category} onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))}>
                  <option>Antibiotics</option>
                  <option>Analgesics</option>
                  <option>Hypertension</option>
                  <option>Vaccines</option>
                  <option>Syrups</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Dosage</label>
                <input className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium text-on-surface outline-none border-2 border-transparent focus:border-primary transition-all" type="text" value={formData.dosage} onChange={(e) => setFormData((current) => ({ ...current, dosage: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Batch Number</label>
                <input className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium text-on-surface outline-none border-2 border-transparent focus:border-primary transition-all" type="text" value={formData.batchNumber} onChange={(e) => setFormData((current) => ({ ...current, batchNumber: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Internal Clinical Notes</label>
              <textarea className="w-full bg-surface-container-low rounded-xl p-4 font-medium text-on-surface outline-none border-2 border-transparent focus:border-primary transition-all resize-none" rows={3} value={formData.notes} onChange={(e) => setFormData((current) => ({ ...current, notes: e.target.value }))}></textarea>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Stock Level</label>
                <input className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-lg text-center" type="number" value={formData.stock} onChange={(e) => setFormData((current) => ({ ...current, stock: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price (ETB)</label>
                <input className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-lg text-center text-[#004A8F]" type="number" value={formData.price} onChange={(e) => setFormData((current) => ({ ...current, price: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</label>
                <input className="w-full bg-gray-50 rounded-xl px-4 py-3 font-medium text-on-surface" type="date" value={formData.expiryDate} onChange={(e) => setFormData((current) => ({ ...current, expiryDate: e.target.value }))} required />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#004A8F] text-white font-black rounded-xl shadow-lg hover:bg-[#003870] transition-all">
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
