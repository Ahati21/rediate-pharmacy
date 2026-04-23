import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFB] min-h-screen font-sans pb-32 shadow-2xl shadow-gray-200/50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2">
          <span className="material-symbols-outlined text-[#111827]">menu</span>
        </button>
        <h1 className="text-[18px] font-black text-[#004A8F]">Rediate Pharmacy</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4U0Bjf9gCoKPnm2nQyD7chKXjQsQHnBdmwquzZTs4CqVynYg8-59c0gMwLxEdOY147MkFSdXstxhbBec2RxKvVt8zLoYDZuWGiO9UmkPak7SBI8qS43hVyqC_-TSWkfpFSAqf1kdX5sggfAtPSJdKyffao4I3cZqqjDebZuxv8LUguNRzmt2FJIC1XgQ1G5Xcn2_tlRZbnhgzYOQDv4HeZj_7yGJl-d8Q6MKM68kxAvdUDGxvL-MguB4S50EIG1k7lKKxQzm173s" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#6B7280] mb-4">
          <span>Cart</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-[#004A8F]">Checkout</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span>Confirmation</span>
        </div>

        <h2 className="text-[28px] font-black text-[#111827] mb-1">Review & Pay</h2>
        <p className="text-[13px] text-[#6B7280] font-medium mb-8">Finalize your prescription order details below.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forms & Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Information Card */}
            <div className="bg-[#F3F4F6]/50 rounded-[24px] p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                  <h3 className="text-[16px] font-black text-[#111827]">Delivery Information</h3>
                </div>
                <button className="text-[12px] font-bold text-[#004A8F] hover:underline">Change</button>
              </div>
              
              <div className="bg-white rounded-[16px] p-4 mb-3 shadow-sm">
                <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Home Address</p>
                <p className="text-[14px] font-black text-[#111827] mb-1">Bole Sub-city, Woreda 03</p>
                <p className="text-[12px] font-medium text-[#6B7280] mb-3">House No. 1240/B, Addis Ababa</p>
                <div className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#006644] text-[9px] font-black px-2 py-1 rounded-full uppercase">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified Location
                </div>
              </div>

              <div className="bg-[#004A8F] rounded-[16px] p-4 text-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 scale-150 rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[60px]">moped</span>
                </div>
                <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Delivery Method</p>
                <p className="text-[14px] font-black mb-1">Home Delivery</p>
                <p className="text-[12px] font-medium opacity-80">Estimated: Today, 2:00 PM - 5:00 PM</p>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-[#F3F4F6]/50 rounded-[24px] p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <h3 className="text-[16px] font-black text-[#111827]">Payment Method</h3>
              </div>

              <div className="bg-white rounded-[16px] p-4 border-2 border-[#004A8F] shadow-sm flex items-center gap-4 relative">
                <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3uM0T8rS9z9XvXzY_D_rC0W_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM_zM" alt="Chapa" className="h-4 object-contain" />
                </div>
                <div>
                    <p className="text-[14px] font-black text-[#111827]">Chapa Pay</p>
                    <p className="text-[11px] font-medium text-[#6B7280]">Pay securely with Telebirr, CBE, or Cards</p>
                </div>
                <div className="absolute top-4 right-4 w-5 h-5 bg-[#004A8F] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              </div>
              <p className="text-[10px] text-[#6B7280] text-center mt-4 px-4 font-medium leading-relaxed">
                By clicking "Pay Now", you will be redirected to Chapa's secure portal to complete your transaction.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row gap-6 py-4 items-center justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-[#006644] text-[10px] font-black uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span> Secure Transaction
              </div>
              <div className="flex items-center gap-2 text-[#006644] text-[10px] font-black uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span> Certified Pharmacy
              </div>
              <div className="flex items-center gap-2 text-[#6B7280] text-[10px] font-black uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span> 24/7 Expert Help
              </div>
            </div>
          </div>

          {/* Right Column: Summary & CTA */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary */}
            <div className="bg-[#F3F4F6]/50 rounded-[32px] p-8 border border-gray-100 h-fit">
              <h3 className="text-[20px] font-black text-[#111827] mb-6">Order Summary</h3>
              
              <div className="space-y-6 mb-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#004A8F]">
                        <span className="material-symbols-outlined text-[24px]">medication</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[14px] font-black text-[#111827]">Amoxicillin 500mg</h4>
                          <p className="text-[14px] font-black text-[#111827]">345.00 <span className="text-[10px] text-[#6B7280]">ETB</span></p>
                        </div>
                        <p className="text-[11px] font-medium text-[#6B7280] mb-2">Capsules • 30 Units</p>
                        <span className="bg-[#E6F4EA] text-[#006644] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">RX REQUIRED</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#004A8F]">
                        <span className="material-symbols-outlined text-[24px]">vaccines</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[14px] font-black text-[#111827]">Vitamin C Supplement</h4>
                          <p className="text-[14px] font-black text-[#111827]">120.00 <span className="text-[10px] text-[#6B7280]">ETB</span></p>
                        </div>
                        <p className="text-[11px] font-medium text-[#6B7280]">Tablets • 60 Units</p>
                    </div>
                  </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-[14px] font-bold">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="text-[#111827]">465.00 ETB</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-bold">
                    <span className="text-[#6B7280]">Delivery Fee</span>
                    <span className="text-[#006644] uppercase text-[11px] font-black">Free</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-bold">
                    <span className="text-[#6B7280]">Taxes & Fees</span>
                    <span className="text-[#111827]">23.25 ETB</span>
                  </div>
              </div>
            </div>

            {/* Total & Pay Button */}
            <div className="bg-[#004A8F] rounded-[32px] p-8 text-white shadow-xl shadow-[#004A8F]/20 sticky top-24">
              <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[11px] font-black opacity-60 uppercase tracking-widest mb-1">Total Amount Due</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[36px] font-black">488.25</span>
                        <span className="text-[16px] font-black opacity-80">ETB</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                  </div>
              </div>

              <button 
                onClick={() => navigate('/success')}
                className="w-full bg-white text-[#004A8F] font-black py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                  Pay Now
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Help Center */}
            <div className="bg-[#EBF5FA] rounded-[24px] p-6 flex gap-4">
              <div className="w-10 h-10 bg-[#004A8F] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">contact_support</span>
              </div>
              <div>
                  <h4 className="text-[14px] font-black text-[#111827] mb-1">Need help?</h4>
                  <p className="text-[11px] font-medium text-[#4B5563] leading-relaxed">
                    Call +251 11 000 0000 for assistance.
                  </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/search')}
          className="w-full py-8 text-[12px] font-black text-[#6B7280] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-[#111827] transition-colors"
        >
           <span className="material-symbols-outlined text-[16px]">arrow_back</span>
           Continue Shopping
        </button>
      </div>
    </div>
  );
}
