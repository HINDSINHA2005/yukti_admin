import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Image as ImageIcon, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Leads & Enquiries', icon: Inbox, badge: 'Live' },
  { id: 'gallery', label: 'Gallery Media', icon: ImageIcon },
  { id: 'team', label: 'Meet the Team', icon: Users },
  { id: 'internships', label: 'Internships & Careers', icon: Briefcase },
  { id: 'courses', label: 'Course Catalog', icon: GraduationCap },
  { id: 'settings', label: 'System & API Keys', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, newEnquiriesCount = 0 }) {
  return (
    <aside className="w-68 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen backdrop-blur-xl">
      <div>
        {/* Brand Header with Logo */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="h-10 px-2.5 rounded-xl bg-white/10 border border-brand-500/30 flex items-center justify-center shadow-inner">
            <img 
              src="/yukti-logo.svg" 
              alt="Yukti Software Logo" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-tight flex items-center space-x-1">
              <span>Yukti Admin</span>
              <Sparkles className="w-3 h-3 text-brand-400" />
            </h1>
            <p className="text-[10px] font-semibold text-brand-400">Control Center v2.0</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3.5 space-y-1.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-accent-primary text-white shadow-lg shadow-brand-600/25 font-extrabold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'enquiries' && newEnquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white animate-pulse shadow-sm">
                    {newEnquiriesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Links & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
        >
          <span className="flex items-center space-x-2">
            <span>🌐 View Live Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock / Logout</span>
        </button>
      </div>
    </aside>
  );
}
