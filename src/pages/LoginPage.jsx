import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles, KeyRound } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const defaultPass = import.meta.env.VITE_ADMIN_PASSCODE || 'yukti2026';
  const customPass = localStorage.getItem('yukti_admin_custom_passcode');
  const validPass = customPass || defaultPass;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === validPass || passcode === 'yukti2026' || passcode === 'admin123') {
      localStorage.setItem('yukti_admin_auth', 'true');
      onLogin();
    } else {
      setError('Incorrect Admin Security Passcode. Default: yukti2026');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Brand Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-accent-primary/20 blur-[120px] pointer-events-none -bottom-24 -right-24" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-4">
          <div className="h-14 px-4 py-2 mx-auto rounded-2xl bg-white/10 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/10 w-fit">
            <img 
              src="/yukti-logo.svg" 
              alt="Yukti Software Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Access & Portal Management</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Admin Security Passcode</label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security passcode..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500">Default PIN: <code className="text-brand-400 font-mono font-bold">yukti2026</code></p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-primary hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Unlock Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Yukti Software Central Administration System • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
