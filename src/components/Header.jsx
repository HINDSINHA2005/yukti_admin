import React from 'react';
import { RefreshCw, Database, Cloud, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { getCloudinaryConfig } from '../services/cloudinaryService';

export default function Header({ title, subtitle, onRefresh, isRefreshing }) {
  const isFirebaseActive = !!db;
  const cloudConfig = getCloudinaryConfig();
  const isCloudinaryActive = !!(cloudConfig.cloudName && cloudConfig.uploadPreset);

  return (
    <header className="h-16 px-6 bg-white/90 border-b border-slate-200/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>{title}</span>
        </h2>
        {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Connection Status Badges */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Firestore Status */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isFirebaseActive 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <Database className="w-3 h-3 text-emerald-600" />
            <span>Firestore: {isFirebaseActive ? 'Live & Connected' : 'Offline'}</span>
          </div>

          {/* Cloudinary Status */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isCloudinaryActive 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <Cloud className="w-3 h-3 text-blue-600" />
            <span>Cloudinary: {isCloudinaryActive ? 'Ready' : 'Not Configured'}</span>
          </div>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white text-xs font-bold transition-all shadow-md shadow-brand-600/15 disabled:opacity-50 cursor-pointer active:scale-95"
            title="Sync Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Live</span>
          </button>
        )}
      </div>
    </header>
  );
}
