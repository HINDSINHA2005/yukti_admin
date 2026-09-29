import React from 'react';
import { 
  Inbox, 
  Image as ImageIcon, 
  Users, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage({ stats, setActiveTab, enquiries = [] }) {
  const recentEnquiries = enquiries.slice(0, 5);

  const STAT_CARDS = [
    {
      id: 'enquiries',
      title: 'Total Enquiries',
      value: stats.enquiriesCount || 0,
      subtext: `${stats.newEnquiriesCount || 0} New Pending`,
      icon: Inbox,
      color: 'from-emerald-500 to-teal-600',
      tab: 'enquiries'
    },
    {
      id: 'gallery',
      title: 'Gallery Media',
      value: (stats.photosCount || 0) + (stats.videosCount || 0),
      subtext: `${stats.photosCount || 0} Photos, ${stats.videosCount || 0} Videos`,
      icon: ImageIcon,
      color: 'from-blue-600 to-cyan-500',
      tab: 'gallery'
    },
    {
      id: 'team',
      title: 'Team Members',
      value: stats.teamCount || 0,
      subtext: 'Faculty & Mentors',
      icon: Users,
      color: 'from-brand-600 to-emerald-600',
      tab: 'team'
    },
    {
      id: 'internships',
      title: 'Internships',
      value: stats.internshipsCount || 0,
      subtext: 'Active Tracks',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      tab: 'internships'
    },
    {
      id: 'courses',
      title: 'Catalog Tracks',
      value: stats.coursesCount || 0,
      subtext: '16+ Master Tracks',
      icon: GraduationCap,
      color: 'from-indigo-600 to-purple-600',
      tab: 'courses'
    }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-brand-500/30 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Yukti Software Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Website Telemetry & CMS Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time management for course enquiries, media uploads, internship postings, team members, and syllabus tracks.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('enquiries')}
          className="relative z-10 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>View All Enquiries</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.tab)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/40 shadow-lg cursor-pointer transition-all hover:-translate-y-1 group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Leads */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Recent Enquiries</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Live Sync</span>
              </h3>
              <p className="text-xs text-slate-400">Latest form submissions from students and businesses</p>
            </div>
            <button
              onClick={() => setActiveTab('enquiries')}
              className="text-xs font-bold text-brand-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Inbox className="w-10 h-10 mx-auto stroke-1 text-slate-600" />
              <p className="text-xs">No enquiries received yet. Form submissions from the website will sync here live!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{enq.name || 'Anonymous User'}</p>
                    <p className="text-xs text-slate-400 truncate">{enq.email} • {enq.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {enq.type?.replace(/_/g, ' ') || 'General'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {enq.submittedAt ? new Date(enq.submittedAt).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Management Modules */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Quick CMS Shortcuts</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Add Gallery Photo / Video', tab: 'gallery', icon: ImageIcon },
              { label: 'Add Faculty / Team Member', tab: 'team', icon: Users },
              { label: 'Post New Internship Opening', tab: 'internships', icon: Briefcase },
              { label: 'Add New Course / Syllabus', tab: 'courses', icon: GraduationCap },
              { label: 'Configure Cloudinary / Keys', tab: 'settings', icon: Sparkles }
            ].map((shortcut, idx) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(shortcut.tab)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/30 text-xs font-bold text-slate-200 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{shortcut.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
