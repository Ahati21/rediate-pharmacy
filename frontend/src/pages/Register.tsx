import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordInput !== confirmPasswordInput) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await register({
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        password: passwordInput,
      });
      navigate('/');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50"
      >
        {/* Left Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary to-primary-container p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-70 mb-4 block font-label">Rediate Care</span>
            <h2 className="text-4xl font-extrabold leading-tight mb-6 font-headline">Your health, curated with precision.</h2>
            <p className="text-primary-container text-lg font-medium max-w-sm opacity-90 text-on-primary-container">Experience a clinical environment that prioritizes your wellness through modern pharmaceutical intelligence.</p>
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-white">verified</span>
              </div>
              <div>
                <p className="font-bold">Verified Prescriptions</p>
                <p className="text-sm opacity-70">Directly synchronized with your healthcare provider.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-white">health_metrics</span>
              </div>
              <div>
                <p className="font-bold">Automated Dosage Tracking</p>
                <p className="text-sm opacity-70">Smart alerts for consistent patient compliance.</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Right Panel: Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-8 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Login
            </button>
            <header className="mb-10 text-center lg:text-left">
              <h3 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight font-headline">Create Account</h3>
              <p className="text-on-surface-variant font-medium">Join our network of precision healthcare.</p>
              <p className="text-on-surface-variant font-medium mt-2 text-sm">New to Rediate? Register to access clinical services.</p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block ml-1">Full Name</label>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" 
                  placeholder="Dr. Jonathan Reed" 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block ml-1">Email Address</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" placeholder="name@rediate.com" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block ml-1">Phone Number</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" placeholder="+1 (555) 000-0000" type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block ml-1">Password</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" placeholder="••••••••" type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block ml-1">Confirm Password</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" placeholder="••••••••" type="password" value={confirmPasswordInput} onChange={(e) => setConfirmPasswordInput(e.target.value)} required />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <input id="terms" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" required />
                <label htmlFor="terms" className="text-xs text-on-surface-variant font-medium">
                  I agree to the <button type="button" className="text-primary hover:underline">Clinical Terms</button> and <button type="button" className="text-primary hover:underline">Privacy Policy</button>.
                </label>
              </div>

              <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-bold tracking-tight text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>

            <div className="mt-10 pt-10 text-center">
              <p className="text-on-surface-variant font-medium">Already have a medical profile?</p>
              <button onClick={() => navigate('/login')} className="inline-block mt-2 text-primary font-bold hover:underline transition-colors">Return to Clinical Login</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
