import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadToCloudinary, getCloudinaryConfig } from '../services/cloudinaryService';

export default function ImageUploader({ value, onChange, label = 'Image / Media URL', placeholder = 'https://images.unsplash.com/...' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const cloudConfig = getCloudinaryConfig();
  const isCloudinarySet = !!(cloudConfig.cloudName && cloudConfig.uploadPreset);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const res = await uploadToCloudinary(file, 'image');
      onChange(res.secure_url || res.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Image upload failed. Check Cloudinary settings or paste image URL directly.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300">{label}</label>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              activeMode === 'upload' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              activeMode === 'url' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {activeMode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!value ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload Image'}
                </p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2 flex items-center space-x-3">
              <img src={value} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{value}</p>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Image Attached</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!isCloudinarySet && (
            <p className="text-[11px] text-amber-400/90 mt-1">
              Tip: Configure Cloudinary keys in Settings to enable 1-click photo uploads, or switch to "Direct URL" mode.
            </p>
          )}
        </div>
      )}

      {activeMode === 'url' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {value && (
            <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-800/40 border border-slate-700">
              <img src={value} alt="Preview" className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="text-[11px] text-slate-300">Live URL Preview</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}
