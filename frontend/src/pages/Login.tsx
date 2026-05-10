import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      const user = await login({
        email: emailInput,
        password: passwordInput,
        role: selectedRole,
      });

      if (user.role === 'customer') navigate('/');
      else if (user.role === 'pharmacist') navigate('/pharmacist/queue');
      else navigate('/admin/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-login-overlay min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-white/95 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50"
      >
        {/* Left Side: Brand Image */}
        <div className="relative hidden md:block h-full min-h-[600px]">
          <img 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5VPg_vlzgiDwmYAbQAEXSZ7fY7wg2IDFJGsegC1tp_OZb7JJKxCEeoG6RozqzbzimmeIwa1xDfdr3y4DxUWvFS6pkIlt9xzIdUZoI-wc5RurYh7YZzmXpiX8YqT_20kF_oZ1ezB7l0sVecLG_1oZ61LwwdS7psSaFiUHEOqkOHsPuP2Sxe2nch0hg_i4h6AW3upx1UQBnRTEUHb6_v5Kg9BMrjyKTK4oGhs_skllFLiUz2qVeCUZ5U_sVz-6LiiGuuZENXURUs4w" 
            alt="Pharmacy Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <span className="text-xs font-bold tracking-[0.2rem] uppercase opacity-70 mb-4 block">Rediate Pharmacy</span>
            <h2 className="text-4xl font-extrabold leading-tight mb-6 font-headline">Clinical care, reimagined for you.</h2>
            <p className="text-surface-container-low text-lg opacity-90 max-w-sm">Access your prescriptions and health records with high-end precision.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <span className="inline-flex items-center justify-center w-12 h-12 bg-secondary-container rounded-xl mb-6 shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">lock_open</span>
            </span>
            <h3 className="text-3xl font-bold text-on-surface tracking-tight mb-2 font-headline">Welcome Back</h3>
            <p className="text-on-surface-variant font-medium">Please enter your credentials to access the portal</p>
          </div>

          <div className="bg-surface-container-low p-1.5 rounded-xl flex mb-10 border border-outline-variant/30 relative">
            {(['customer', 'pharmacist', 'admin'] as const).map((roleVal) => (
              <button
                key={roleVal}
                onClick={() => setSelectedRole(roleVal)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all z-10",
                  selectedRole === roleVal ? "text-white" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {roleVal === 'customer' ? 'Patient' : roleVal === 'pharmacist' ? 'Pharmacist' : 'Admin'}
              </button>
            ))}
            <motion.div 
               layoutId="role-bg"
               className="absolute bg-primary rounded-lg"
               style={{ 
                 top: '6px', 
                 bottom: '6px', 
                 left: selectedRole === 'customer' ? '6px' : selectedRole === 'pharmacist' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 2px)',
                 width: 'calc(100% / 3 - 8px)'
               }}
            />
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  className="w-full px-5 py-4 bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl text-on-surface placeholder:text-outline focus:ring-0 transition-all" 
                  placeholder="name@rediate.com"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
                <button type="button" className="text-xs font-semibold text-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <input 
                  className="w-full px-5 py-4 bg-surface-container-low border-b-2 border-transparent focus:border-primary rounded-xl text-on-surface placeholder:text-outline focus:ring-0 transition-all" 
                  placeholder="••••••••"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">visibility</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-low" 
              />
              <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant cursor-pointer select-none">Remember this device for 30 days</label>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In to Rediate'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <div className="flex items-center gap-2 justify-center mb-3 py-2 px-3 bg-secondary-container/30 rounded-lg border border-secondary-container/50">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Registration is required for all new customers</p>
            </div>
            <p className="text-sm text-on-surface-variant">
              New to Rediate Pharmacy? 
              <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create an Account</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
