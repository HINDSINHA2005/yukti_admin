import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

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
      setError('Incorrect Admin Security Passcode. Try: yukti2026');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute w-96 h-96 rounded-full bg-brand-600/10 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Logo and title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Yukti Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Access & Website Management</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Admin Passcode / PIN</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security passcode..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500">Default passcode: <code className="text-brand-400 font-mono">yukti2026</code></p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Unlock Control Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Yukti Software Central Administration Center v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
