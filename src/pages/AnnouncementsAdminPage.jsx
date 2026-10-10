import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AnnouncementsAdminPage() {
  const [settings, setSettings] = useState({
    announcementText: '🎓 Admissions Open 2026',
    discountBadge: 'Up to 30% Scholarship',
    ctaText: 'Claim Now',
    supportPhone: '+91 95828 15419',
    supportEmail: 'contact@yuktisoftware.com',
    centerAddress: '503, MSX Tower 1, Alpha 1, Greater Noida',
    showVerificationBadge: true,
    showTicker: true,
    customNotice: 'New Batch Starting This Monday for Python Full Stack & Java Microservices. Limited Seats!'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      if (!db) return;
      const docRef = doc(db, 'site_settings', 'announcements');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSettings(prev => ({ ...prev, ...snap.data() }));
      }
    } catch (err) {
      console.warn('Could not load Firestore announcement settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (!db) throw new Error('Firestore not initialized.');
      const docRef = doc(db, 'site_settings', 'announcements');
      await setDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSuccessMsg('Announcement banner and site settings updated successfully in Firestore!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-xs">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Live Announcement & Notice Manager
            </h2>
            <p className="text-xs text-slate-500">
              Control the top notification ticker, scholarship promotions, and center contact details in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={loadSettings}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Live Settings</span>
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
          <span className="flex items-center space-x-1.5 font-bold text-white">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>LIVE WEBSITE BANNER PREVIEW</span>
          </span>
          <span className="text-slate-500">Top Header on Desktop & Mobile</span>
        </div>

        <div className="bg-slate-900/90 py-2 px-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1 text-slate-300">
              <Phone className="w-3 h-3 text-brand-400" />
              <span>Direct Support: <strong className="text-white">{settings.supportPhone}</strong></span>
            </span>
            <span className="hidden sm:flex items-center space-x-1 text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{settings.centerAddress}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            {settings.showVerificationBadge && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-extrabold text-[10px]">
                🛡️ Verify Certificate
              </span>
            )}
            <span className="flex items-center space-x-1 text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <span>{settings.announcementText}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-extrabold">{settings.discountBadge}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white font-extrabold text-[10px]">
              {settings.ctaText} &gt;
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Configure Promotion & Header Elements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Announcement Main Heading */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ticker Headline
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="e.g. 🎓 Admissions Open 2026"
              required
            />
          </div>

          {/* Scholarship / Badge */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Highlight Badge / Discount
            </label>
            <input
              type="text"
              value={settings.discountBadge}
              onChange={(e) => setSettings({ ...settings, discountBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="e.g. Up to 30% Scholarship"
              required
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Action Button Text
            </label>
            <input
              type="text"
              value={settings.ctaText}
              onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="e.g. Claim Now"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Direct Support Phone
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="+91 95828 15419"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="contact@yuktisoftware.com"
              required
            />
          </div>

          {/* Short Center Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Center Short Address
            </label>
            <input
              type="text"
              value={settings.centerAddress}
              onChange={(e) => setSettings({ ...settings, centerAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="503, MSX Tower 1, Alpha 1, Greater Noida"
              required
            />
          </div>
        </div>

        {/* Custom Notice Box */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Special Batch / Urgent Notice (Optional Broadcast)
          </label>
          <textarea
            rows="2"
            value={settings.customNotice}
            onChange={(e) => setSettings({ ...settings, customNotice: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="Special flash notices for students & applicants..."
          />
        </div>

        {/* Toggle options */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={settings.showVerificationBadge}
              onChange={(e) => setSettings({ ...settings, showVerificationBadge: e.target.checked })}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Show "Verify Certificate" in Announcement Bar</span>
          </label>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Firestore...' : 'Save & Publish Live Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
