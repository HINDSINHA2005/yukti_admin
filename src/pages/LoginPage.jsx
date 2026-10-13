import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  KeyRound,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { signInAdmin, OFFICIAL_ADMIN_EMAIL } from '../services/authService';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(OFFICIAL_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await signInAdmin(email, password);
      if (onLogin) {
        onLogin(user);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail(OFFICIAL_ADMIN_EMAIL);
    setPassword('yukti2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Ambient Brand Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none -top-24 -left-24" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-accent-primary/10 blur-[100px] pointer-events-none -bottom-24 -right-24" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-2xl space-y-6">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="h-14 px-4 py-2 mx-auto rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center w-fit">
            <img 
              src="/yukti-logo.svg" 
              alt="Yukti Software Logo" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-slate-500 mt-1">Firebase Protected Access & Portal Management</p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase Authentication Active</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Admin Email</span>
              <span className="text-[10px] text-brand-600 font-semibold">Firebase Identity</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@yuktisoftware.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Admin Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Admin Password</span>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
              >
                Auto-fill Default
              </button>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-primary hover:from-brand-500 hover:to-accent-primary hover:scale-[1.01] active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 disabled:opacity-60 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-700 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-brand-600" />
            <span>Master Admin Credentials</span>
          </p>
          <p className="font-mono text-[11px] text-slate-600">
            Email: <strong className="text-slate-800">contact@yuktisoftware.com</strong><br />
            Password: <strong className="text-slate-800">yukti2026</strong>
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Yukti Software Central Administration System • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
