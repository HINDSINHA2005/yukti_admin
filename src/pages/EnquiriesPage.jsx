import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  Phone, 
  ExternalLink, 
  Eye, 
  X, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Copy,
  Check,
  Building2,
  GraduationCap,
  Globe,
  Calendar,
  Code2,
  Laptop,
  FileText,
  Sparkles,
  PhoneCall,
  User,
  Layers,
  MapPin,
  Link as LinkIcon,
  Briefcase
} from 'lucide-react';
import { updateEnquiryStatus, deleteEnquiry } from '../services/adminService.js';

export default function EnquiriesPage({ enquiries = [], onRefresh, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Helper to extract resume / portfolio / github link from any variation
  const getApplicantLink = (enq) => {
    if (!enq) return '';
    return (
      enq.githubOrResume ||
      enq.githubOrPortfolio ||
      enq.resume ||
      enq.resumeUrl ||
      enq.portfolio ||
      enq.github ||
      enq.linkedin ||
      enq.driveLink ||
      enq.link ||
      ''
    ).trim();
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || (item.status || 'new') === filterStatus;
    
    if (!matchesType || !matchesStatus) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const course = (item.course || item.service || item.selectedTarget || item.rolePreference || '').toLowerCase();
    const college = (item.college || item.organization || '').toLowerCase();
    const message = (item.message || '').toLowerCase();
    const formSource = (item.formSource || '').toLowerCase();
    const link = getApplicantLink(item).toLowerCase();

    return (
      name.includes(term) || 
      email.includes(term) || 
      phone.includes(term) || 
      course.includes(term) || 
      college.includes(term) ||
      message.includes(term) ||
      formSource.includes(term) ||
      link.includes(term)
    );
  });

  const handleStatusChange = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await updateEnquiryStatus(id, newStatus);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    setDeletingId(id);
    try {
      await deleteEnquiry(id);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error deleting enquiry: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text, fieldName, e) => {
    if (e) e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullEnquirySummary = (enq, e) => {
    if (e) e.stopPropagation();
    if (!enq) return;
    const applicantLink = getApplicantLink(enq);
    const summary = [
      `=== YUKTI SOFTWARE INBOUND ENQUIRY ===`,
      `Submitter Name : ${enq.name || 'N/A'}`,
      `Phone Number   : ${enq.phone || 'N/A'}`,
      `Email Address  : ${enq.email || 'N/A'}`,
      enq.college ? `College/Univ   : ${enq.college}` : null,
      enq.semester ? `Semester/Year  : ${enq.semester}` : null,
      enq.organization ? `Organization   : ${enq.organization}` : null,
      enq.course ? `Course Track   : ${enq.course}` : null,
      enq.service ? `Service/Role   : ${enq.service}` : null,
      enq.rolePreference ? `Role Applied   : ${enq.rolePreference}` : null,
      enq.domain ? `Tech Domain    : ${enq.domain}` : null,
      enq.trackType ? `Track Type     : ${enq.trackType}` : null,
      enq.mode ? `Training Mode  : ${enq.mode}` : null,
      applicantLink ? `Resume/Link    : ${applicantLink}` : `Resume/Link    : Not provided`,
      enq.formSource ? `Form Source    : ${enq.formSource}` : null,
      enq.sourceUrl ? `Source Page    : ${enq.sourceUrl}` : null,
      `Submitted At   : ${enq.submittedAt ? new Date(enq.submittedAt).toLocaleString('en-IN') : 'N/A'}`,
      `Current Status : ${(enq.status || 'new').toUpperCase()}`,
      `Message/Query  : ${enq.message || 'No additional message.'}`,
      `======================================`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const formatWhatsAppNumber = (phone = '') => {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 10) clean = '91' + clean;
    return clean;
  };

  const exportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    const headers = [
      'Submitted At', 
      'Name', 
      'Email', 
      'Phone', 
      'College / Organization', 
      'Type', 
      'Course / Role Preference', 
      'Resume / Portfolio Link',
      'Training Mode', 
      'Form Source', 
      'Status', 
      'Message'
    ];
    const rows = filteredEnquiries.map(e => [
      `"${e.submittedAt || ''}"`,
      `"${e.name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.college || e.organization || ''}"`,
      `"${e.type || ''}"`,
      `"${e.course || e.service || e.rolePreference || e.selectedTarget || ''}"`,
      `"${getApplicantLink(e)}"`,
      `"${e.mode || ''}"`,
      `"${e.formSource || ''}"`,
      `"${e.status || 'new'}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yukti_leads_full_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to extract arbitrary extra metadata fields
  const getExtraFields = (enq) => {
    if (!enq) return [];
    const knownKeys = new Set([
      'id', 'name', 'email', 'phone', 'course', 'service', 'message', 'mode', 
      'type', 'status', 'sourceUrl', 'submittedAt', 'serverTimestamp', 'college', 
      'semester', 'domain', 'trackType', 'rolePreference', 'githubOrResume', 
      'githubOrPortfolio', 'resume', 'resumeUrl', 'portfolio', 'github', 'organization', 
      'company', 'inquiryCategory', 'selectedTarget', 'formSource', 'category', 'updatedAt'
    ]);
    return Object.entries(enq).filter(([k, v]) => !knownKeys.has(k) && v !== null && v !== undefined && typeof v !== 'object');
  };

  return (
    <div className="w-full max-w-full px-3 sm:px-6 py-6 space-y-5">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Enquiries & Inbound Leads</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Live Submissions ({enquiries.length})
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Click any row to open the complete application form with college, resume links & messages.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            disabled={filteredEnquiries.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, college, course, resume link, form source..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Types</option>
          <option value="course_enquiry">Course Enquiries</option>
          <option value="career_apply">Internship & Career Applications</option>
          <option value="software_development">Enterprise Software Solutions</option>
          <option value="demo_booking">Book Free Demo</option>
          <option value="contact">General Contact</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">In Progress</option>
          <option value="enrolled">Enrolled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ========================================================================= */}
      {/* RESPONSIVE FULL-WIDTH ENQUIRIES TABLE (NO HORIZONTAL SCROLL) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-[28%]">Applicant & College</th>
                <th className="px-4 py-3 w-[24%]">Target Program / Track</th>
                <th className="px-3 py-3 w-[20%]">Origin & Submitted Date</th>
                <th className="px-2 py-3 w-[13%] min-w-[95px] text-center">Status</th>
                <th className="px-3 py-3 w-[15%] min-w-[135px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 space-y-1.5">
                    <MessageSquare className="w-7 h-7 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-600">No matching enquiries found.</p>
                    <p className="text-xs text-slate-400">Submissions made from the main website will appear here live.</p>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const cleanPhone = formatWhatsAppNumber(enq.phone);
                  const isNew = (enq.status || 'new') === 'new';
                  const targetCourseOrService = enq.course || enq.service || enq.rolePreference || enq.selectedTarget || enq.domain || 'General Consultation';
                  const academicOrOrg = enq.college || enq.organization || enq.company;
                  const applicantLink = getApplicantLink(enq);

                  return (
                    <tr 
                      key={enq.id} 
                      onClick={() => setSelectedEnquiry(enq)}
                      className="hover:bg-brand-50/40 transition-colors group cursor-pointer"
                      title="Click anywhere to open full form details"
                    >
                      
                      {/* Submitter Details */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-brand-700 transition-colors">
                              {enq.name || 'Anonymous User'}
                            </span>
                            {isNew && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-emerald-500 text-white animate-pulse shrink-0">
                                NEW
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-slate-500 text-[11px]">
                            {enq.phone && (
                              <a 
                                href={`tel:${enq.phone}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono text-slate-700 font-bold hover:text-brand-600"
                              >
                                {enq.phone}
                              </a>
                            )}
                            {enq.email && enq.phone && <span>•</span>}
                            {enq.email && (
                              <a 
                                href={`mailto:${enq.email}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-brand-600 truncate max-w-[150px]" 
                                title={enq.email}
                              >
                                {enq.email}
                              </a>
                            )}
                          </div>

                          {/* College / Institution */}
                          {academicOrOrg && (
                            <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-600 pt-0.5">
                              <GraduationCap className="w-3 h-3 text-brand-600 shrink-0" />
                              <span className="truncate" title={academicOrOrg}>{academicOrOrg}</span>
                            </div>
                          )}

                          {/* Resume / Portfolio Link attached badge */}
                          {applicantLink && (
                            <div className="pt-0.5">
                              <a
                                href={applicantLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold border border-blue-200 transition-colors"
                                title={applicantLink}
                              >
                                <LinkIcon className="w-2.5 h-2.5 shrink-0" />
                                <span>Resume / Portfolio Link ↗</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Course / Program Track */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-brand-50 text-brand-700 border border-brand-200">
                            {enq.type?.replace(/_/g, ' ') || 'General Enquiry'}
                          </span>
                          <p className="text-slate-900 font-bold text-xs line-clamp-2" title={targetCourseOrService}>
                            {targetCourseOrService}
                          </p>
                          {enq.mode && (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{enq.mode}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Origin & Date */}
                      <td className="px-3 py-3.5 align-top">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-700 leading-tight break-words" title={enq.formSource || 'Website Form'}>
                            {enq.formSource || 'Website Form'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {enq.submittedAt ? new Date(enq.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}{' '}
                            <span className="text-slate-400 font-normal">
                              {enq.submittedAt ? new Date(enq.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </p>
                          {enq.sourceUrl && (
                            <a 
                              href={enq.sourceUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] text-brand-600 hover:underline flex items-center space-x-1 truncate max-w-[140px]"
                              title={enq.sourceUrl}
                            >
                              <Globe className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{enq.sourceUrl.replace(/^https?:\/\/[^/]+/i, '') || '/'}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-2 py-3.5 align-top text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <select
                            value={enq.status || 'new'}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value, e)}
                            className={`w-[84px] px-1.5 py-1 rounded-lg text-[9px] font-black uppercase border focus:outline-none cursor-pointer transition-all ${
                              (enq.status || 'new') === 'new'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                                : enq.status === 'contacted'
                                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                                : enq.status === 'in_progress'
                                ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                                : enq.status === 'enrolled'
                                ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                                : 'bg-slate-100 border-slate-300 text-slate-600'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      {/* Quick Actions (Always Visible on screen) */}
                      <td className="px-3 py-3.5 align-top text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1 shrink-0">
                          
                          {/* 1-Click WhatsApp */}
                          {enq.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.name || ''}, thank you for contacting Yukti Software regarding ${targetCourseOrService}. We would love to share curriculum and next batch details with you!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="shrink-0 p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* 1-Click Email */}
                          {enq.email && (
                            <a
                              href={`mailto:${enq.email}?subject=${encodeURIComponent(`Yukti Software - Details regarding your application for ${targetCourseOrService}`)}`}
                              title="Send Email"
                              className="shrink-0 p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* View Full Form Button */}
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            title="Open Full Form Details"
                            className="shrink-0 p-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDelete(enq.id, e)}
                            disabled={deletingId === enq.id}
                            title="Delete Enquiry"
                            className="shrink-0 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE FULL FORM APPLICATION DETAILS MODAL (ALL FIELDS SHOWN) */}
      {/* ========================================================================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-6 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30">
                    {selectedEnquiry.type?.replace(/_/g, ' ') || 'Website Inbound Form'}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono">
                    ID: {selectedEnquiry.id}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                  <span>{selectedEnquiry.name || 'Anonymous User'}</span>
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => copyFullEnquirySummary(selectedEnquiry, e)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Copy formatted summary to clipboard"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1 text-slate-800 bg-slate-50/50">
              
              {/* SECTION 1: Personal & Contact Information */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Applicant Personal & Contact Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Full Name */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedEnquiry.name || 'Not provided'}</span>
                  </div>

                  {/* Email */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate" title={selectedEnquiry.email}>
                        {selectedEnquiry.email || 'Not provided'}
                      </span>
                      {selectedEnquiry.email && (
                        <button
                          onClick={(e) => copyToClipboard(selectedEnquiry.email, 'email', e)}
                          className="p-1 text-slate-400 hover:text-brand-600 cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {selectedEnquiry.phone || 'Not provided'}
                      </span>
                      {selectedEnquiry.phone && (
                        <button
                          onClick={(e) => copyToClipboard(selectedEnquiry.phone, 'phone', e)}
                          className="p-1 text-slate-400 hover:text-brand-600 cursor-pointer"
                          title="Copy Phone"
                        >
                          {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Academic & Institutional Information (Always Shown) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>2. Academic Background & Institutional Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* College / University */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / University / Degree</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.college || <span className="text-slate-400 italic font-normal">Not specified</span>}
                    </span>
                  </div>

                  {/* Semester */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Semester / Academic Year</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.semester || <span className="text-slate-400 italic font-normal">Not specified</span>}
                    </span>
                  </div>

                  {/* Organization */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Organization / Company Name</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.organization || selectedEnquiry.company || <span className="text-slate-400 italic font-normal">Not applicable / Individual</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: RESUME / GITHUB / PORTFOLIO LINK (ALWAYS EXPLICITLY SHOWN) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <LinkIcon className="w-4 h-4" />
                  <span>3. Resume / Portfolio / GitHub Project Link</span>
                </h4>

                {getApplicantLink(selectedEnquiry) ? (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Link Provided by Applicant:</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => copyToClipboard(getApplicantLink(selectedEnquiry), 'resumeLink', e)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          {copiedField === 'resumeLink' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'resumeLink' ? 'Copied' : 'Copy Link'}</span>
                        </button>
                        <a
                          href={getApplicantLink(selectedEnquiry)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open in New Tab ↗</span>
                        </a>
                      </div>
                    </div>

                    <a
                      href={getApplicantLink(selectedEnquiry)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-bold text-blue-700 hover:underline break-all block pt-0.5"
                    >
                      {getApplicantLink(selectedEnquiry)}
                    </a>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      <strong>No Resume / Portfolio link provided.</strong> (Applicant left this optional field blank on the website form).
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION 4: Course & Technical Preferences */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4" />
                  <span>4. Course & Technical Training Preferences</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course / Program</span>
                    <span className="text-xs font-black text-brand-700 mt-0.5 block">
                      {selectedEnquiry.course || selectedEnquiry.selectedTarget || 'General Training'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Role Preference / Service</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.rolePreference || selectedEnquiry.service || <span className="text-slate-400 italic font-normal">Not specified</span>}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Training Delivery Mode</span>
                    <span className="text-xs font-extrabold text-emerald-700 mt-0.5 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedEnquiry.mode || 'Classroom / Online'}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Technology Domain</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.domain || <span className="text-slate-400 italic font-normal">Standard Domain</span>}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Internship Track Type</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.trackType || <span className="text-slate-400 italic font-normal">Standard Track</span>}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Category</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.inquiryCategory || selectedEnquiry.category || 'Direct Application'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Full Message / Application Statement */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4" />
                  <span>5. Complete User Message / Application Notes</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedEnquiry.message || 'No additional message was provided with this submission.'}
                </div>
              </div>

              {/* SECTION 6: Submission Origin & Telemetry */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4" />
                  <span>6. Web Form Telemetry & Tracking</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Originating Website Form</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{selectedEnquiry.formSource || 'Yukti Main Website Form'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Timestamp</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {selectedEnquiry.submittedAt ? new Date(selectedEnquiry.submittedAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' }) : 'N/A'}
                    </span>
                  </div>

                  {selectedEnquiry.sourceUrl && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exact Webpage URL</span>
                      <a
                        href={selectedEnquiry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono font-semibold text-brand-600 hover:underline flex items-center space-x-1.5 truncate mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{selectedEnquiry.sourceUrl}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 7: Any Extra Arbitrary Fields */}
              {getExtraFields(selectedEnquiry).length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>7. Additional Form Attributes</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {getExtraFields(selectedEnquiry).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{key}</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Status Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Lead Status:</span>
                <select
                  value={selectedEnquiry.status || 'new'}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value, e)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Direct Outreach Action Buttons */}
              <div className="flex items-center space-x-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call</span>
                  </a>
                )}

                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(selectedEnquiry.phone)}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name || ''}, thank you for reaching out to Yukti Software regarding ${selectedEnquiry.course || selectedEnquiry.service || selectedEnquiry.rolePreference || 'our programs'}. How can we assist you today?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(`Yukti Software - Regarding your enquiry for ${selectedEnquiry.course || selectedEnquiry.service || selectedEnquiry.rolePreference || 'our training programs'}`)}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
