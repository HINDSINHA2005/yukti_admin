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
  ShieldCheck
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries & Leads', icon: Inbox, badge: 'Live' },
  { id: 'gallery', label: 'Gallery (Photos/Videos)', icon: ImageIcon },
  { id: 'team', label: 'Meet the Team', icon: Users },
  { id: 'internships', label: 'Internships & Careers', icon: Briefcase },
  { id: 'courses', label: 'Courses Management', icon: GraduationCap },
  { id: 'settings', label: 'API & Cloudinary Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, newEnquiriesCount = 0 }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">Yukti Control</h1>
            <p className="text-[11px] font-semibold text-brand-400">Admin Control Center</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-extrabold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'enquiries' && newEnquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white animate-pulse">
                    {newEnquiriesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Links & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <span>View Live Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock / Logout</span>
        </button>
      </div>
    </aside>
  );
}
