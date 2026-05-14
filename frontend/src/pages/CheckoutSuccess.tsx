import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const tx_ref = searchParams.get('trx_ref') || searchParams.get('tx_ref');
    
    async function verify() {
      if (!tx_ref) {
        setStatus('success');
        setMessage('Order placed successfully!');
        return;
      }

      try {
        const response = await api.post<any>('/payment/verify', { tx_ref });
        if (response.success) {
          setStatus('success');
          setMessage('Payment confirmed! Your order is being processed.');
        } else {
          setStatus('error');
          setMessage(response.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('We couldn\'t verify your payment automatically. Please contact support.');
      }
    }

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA] px-6">
      <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#004A8F] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-black text-[#111827] mb-2">Almost There</h2>
            <p className="text-[#6B7280] font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[40px]">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-[#111827] mb-2">Thank You!</h2>
            <p className="text-[#6B7280] font-medium mb-8">{message}</p>
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#004A8F] text-white font-black py-4 rounded-2xl hover:bg-[#003A70] transition-all shadow-lg shadow-blue-900/10"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[40px]">error</span>
            </div>
            <h2 className="text-2xl font-black text-[#111827] mb-2">Payment Issue</h2>
            <p className="text-[#6B7280] font-medium mb-8">{message}</p>
            <div className="space-y-3 w-full">
              <button 
                onClick={() => navigate('/')} 
                className="w-full bg-[#111827] text-white font-black py-4 rounded-2xl"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full text-[#004A8F] font-black py-2"
              >
                Retry Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
