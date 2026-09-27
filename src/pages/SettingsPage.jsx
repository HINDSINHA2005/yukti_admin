import React, { useState } from 'react';
import { 
  Save, 
  Cloud, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { getFirebaseConfig } from '../firebase';
import { getCloudinaryConfig } from '../services/cloudinaryService';

export default function SettingsPage({ onConfigUpdated }) {
  const currentFb = getFirebaseConfig();
  const currentCloud = getCloudinaryConfig();

  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: currentFb.apiKey || '',
    authDomain: currentFb.authDomain || '',
    projectId: currentFb.projectId || '',
    storageBucket: currentFb.storageBucket || '',
    messagingSenderId: currentFb.messagingSenderId || '',
    appId: currentFb.appId || ''
  });

  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloudName: currentCloud.cloudName || '',
    uploadPreset: currentCloud.uploadPreset || ''
  });

  const [customPasscode, setCustomPasscode] = useState(
    localStorage.getItem('yukti_admin_custom_passcode') || ''
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('yukti_admin_firebase_config', JSON.stringify(firebaseConfig));
    localStorage.setItem('yukti_admin_cloudinary_config', JSON.stringify(cloudinaryConfig));
    if (customPasscode.trim()) {
      localStorage.setItem('yukti_admin_custom_passcode', customPasscode.trim());
    }

    setSavedSuccess(true);
    if (onConfigUpdated) onConfigUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      window.location.reload();
    }, 1200);
  };

  const handleClear = () => {
    if (window.confirm('Reset custom settings to .env defaults?')) {
      localStorage.removeItem('yukti_admin_firebase_config');
      localStorage.removeItem('yukti_admin_cloudinary_config');
      localStorage.removeItem('yukti_admin_custom_passcode');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">API & Cloud Configuration</h1>
        <p className="text-xs text-slate-400">Configure your live Firebase Firestore and Cloudinary media upload credentials</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Settings saved successfully! Reloading configuration...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. CLOUDINARY CONFIGURATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cloudinary Image Uploads</h3>
                <p className="text-xs text-slate-400">Direct media storage for gallery and team photos</p>
              </div>
            </div>
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>Get Free Cloudinary</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Cloud Name</label>
              <input
                type="text"
                value={cloudinaryConfig.cloudName}
                onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudName: e.target.value.trim() })}
                placeholder="e.g. dxyz1234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Upload Preset (Unsigned)</label>
              <input
                type="text"
                value={cloudinaryConfig.uploadPreset}
                onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, uploadPreset: e.target.value.trim() })}
                placeholder="e.g. yukti_uploads"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            In Cloudinary Dashboard: Go to <strong>Settings &rarr; Upload &rarr; Add upload preset &rarr; Set Signing Mode to 'Unsigned'</strong>.
          </p>
        </div>

        {/* 2. FIREBASE FIRESTORE CONFIGURATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Firebase Firestore Database</h3>
                <p className="text-xs text-slate-400">Stores all leads, enquiries, and dynamic content</p>
              </div>
            </div>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">API Key (VITE_FIREBASE_API_KEY)</label>
              <input
                type="text"
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value.trim() })}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Project ID (VITE_FIREBASE_PROJECT_ID)</label>
              <input
                type="text"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value.trim() })}
                placeholder="yukti-website-1234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Auth Domain</label>
              <input
                type="text"
                value={firebaseConfig.authDomain}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value.trim() })}
                placeholder="yukti-website.firebaseapp.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Storage Bucket</label>
              <input
                type="text"
                value={firebaseConfig.storageBucket}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value.trim() })}
                placeholder="yukti-website.appspot.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">App ID</label>
              <input
                type="text"
                value={firebaseConfig.appId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value.trim() })}
                placeholder="1:123456:web:abcd"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Messaging Sender ID</label>
              <input
                type="text"
                value={firebaseConfig.messagingSenderId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value.trim() })}
                placeholder="1234567890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. SECURITY PASSCODE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Admin Security Passcode</h3>
              <p className="text-xs text-slate-400">Custom PIN required to unlock this portal</p>
            </div>
          </div>

          <div className="max-w-xs space-y-1">
            <label className="text-xs font-bold text-slate-300">Custom Passcode</label>
            <input
              type="text"
              value={customPasscode}
              onChange={(e) => setCustomPasscode(e.target.value)}
              placeholder="yukti2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            Reset to Defaults
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center space-x-2 hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
