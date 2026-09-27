import React from 'react';
import { RefreshCw, Database, Cloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { getCloudinaryConfig } from '../services/cloudinaryService';

export default function Header({ title, subtitle, onRefresh, isRefreshing }) {
  const isFirebaseActive = !!db;
  const cloudConfig = getCloudinaryConfig();
  const isCloudinaryActive = !!(cloudConfig.cloudName && cloudConfig.uploadPreset);

  return (
    <header className="h-16 px-6 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-black text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Connection Status Badges */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Firestore Status */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isFirebaseActive 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <Database className="w-3 h-3" />
            <span>Firestore: {isFirebaseActive ? 'Connected' : 'Offline / Keys Missing'}</span>
          </div>

          {/* Cloudinary Status */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isCloudinaryActive 
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Cloud className="w-3 h-3" />
            <span>Cloudinary: {isCloudinaryActive ? 'Ready' : 'Not Set'}</span>
          </div>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        )}
      </div>
    </header>
  );
}
