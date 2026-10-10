import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Image as ImageIcon, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Award,
  Calendar,
  Megaphone,
  MessageSquareQuote,
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'batches', label: 'Upcoming Batches', icon: Calendar },
  { id: 'certificates', label: 'Certificates & Offers', icon: Award },
  { id: 'announcements', label: 'Announcements & Banner', icon: Megaphone },
  { id: 'reviews', label: 'Student Reviews & Stories', icon: MessageSquareQuote },
  { id: 'enquiries', label: 'Leads & Enquiries', icon: Inbox, badge: 'Live' },
  { id: 'gallery', label: 'Gallery Media', icon: ImageIcon },
  { id: 'team', label: 'Meet the Team', icon: Users },
  { id: 'internships', label: 'Internships & Careers', icon: Briefcase },
  { id: 'courses', label: 'Course Catalog', icon: GraduationCap },
  { id: 'settings', label: 'System & API Keys', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, newEnquiriesCount = 0 }) {
  return (
    <aside className="w-68 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 min-h-screen shadow-sm z-20">
      <div>
        {/* Brand Header with Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
          <div className="h-10 px-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            <img 
              src="/yukti-logo.svg" 
              alt="Yukti Software Logo" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight flex items-center space-x-1">
              <span>Yukti Admin</span>
              <Sparkles className="w-3 h-3 text-brand-600" />
            </h1>
            <p className="text-[10px] font-bold text-brand-600">Control Center v2.0</p>
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
                    ? 'bg-gradient-to-r from-brand-600 to-accent-primary text-white shadow-md shadow-brand-600/20 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'enquiries' && newEnquiriesCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-white text-brand-700' : 'bg-emerald-500 text-white animate-pulse shadow-sm'}`}>
                    {newEnquiriesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Links & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <a
          href="https://yuktisoftware.com"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all border border-transparent hover:border-slate-200 shadow-xs"
        >
          <span className="flex items-center space-x-2">
            <span>🌐 View Live Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock / Logout</span>
        </button>
      </div>
    </aside>
  );
}
