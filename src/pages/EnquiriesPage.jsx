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
  MessageSquare
} from 'lucide-react';
import { updateEnquiryStatus, deleteEnquiry } from '../services/adminService';

export default function EnquiriesPage({ enquiries = [], onRefresh, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || (item.status || 'new') === filterStatus;
    
    if (!matchesType || !matchesStatus) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const course = (item.course || item.service || '').toLowerCase();
    const message = (item.message || '').toLowerCase();

    return name.includes(term) || email.includes(term) || phone.includes(term) || course.includes(term) || message.includes(term);
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
      }
      onRefresh();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    setDeletingId(id);
    try {
      await deleteEnquiry(id);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      onRefresh();
    } catch (err) {
      alert('Error deleting enquiry: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    const headers = ['Submitted At', 'Name', 'Email', 'Phone', 'Type', 'Course/Service', 'Status', 'Message'];
    const rows = filteredEnquiries.map(e => [
      `"${e.submittedAt || ''}"`,
      `"${e.name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.type || ''}"`,
      `"${e.course || e.service || ''}"`,
      `"${e.status || 'new'}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yukti_enquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatWhatsAppNumber = (phone = '') => {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 10) clean = '91' + clean;
    return clean;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Enquiries & Leads</h1>
          <p className="text-xs text-slate-500">Total {enquiries.length} submissions recorded in Firebase Firestore</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, course..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Enquiry Types</option>
          <option value="contact">General Contact</option>
          <option value="course_enquiry">Course Enquiry</option>
          <option value="software_development">Software Development</option>
          <option value="demo_booking">Free Demo Booking</option>
          <option value="career_apply">Internship / Career</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">In Progress</option>
          <option value="enrolled">Enrolled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Submitter Details</th>
                <th className="px-5 py-3.5">Category / Track</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No matching enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const cleanPhone = formatWhatsAppNumber(enq.phone);
                  const isNew = (enq.status || 'new') === 'new';
                  return (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                            <span>{enq.name || 'Anonymous User'}</span>
                            {isNew && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                          </p>
                          <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                            <span>{enq.email}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-700 font-semibold">{enq.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                            {enq.type?.replace(/_/g, ' ') || 'General'}
                          </span>
                          <p className="text-slate-800 font-semibold truncate max-w-xs">
                            {enq.course || enq.service || 'General Consultation'}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={enq.status || 'new'}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border focus:outline-none cursor-pointer ${
                            (enq.status || 'new') === 'new'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : enq.status === 'contacted'
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : enq.status === 'in_progress'
                              ? 'bg-amber-50 border-amber-300 text-amber-700'
                              : enq.status === 'enrolled'
                              ? 'bg-purple-50 border-purple-300 text-purple-700'
                              : 'bg-slate-100 border-slate-300 text-slate-600'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {enq.submittedAt ? new Date(enq.submittedAt).toLocaleString() : 'N/A'}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* 1-Click WhatsApp */}
                          {enq.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.name || ''}, thank you for reaching out to Yukti Software regarding ${enq.course || enq.service || 'our programs'}. How can we assist you today?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          )}

                          {/* 1-Click Email */}
                          {enq.email && (
                            <a
                              href={`mailto:${enq.email}?subject=${encodeURIComponent(`Yukti Software - Regarding your enquiry for ${enq.course || enq.service || 'training'}`)}`}
                              title="Send Email"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}

                          {/* View Details Modal */}
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            title="View Details"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(enq.id)}
                            disabled={deletingId === enq.id}
                            title="Delete Enquiry"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                  {selectedEnquiry.type?.replace(/_/g, ' ')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedEnquiry.name}</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Email Address</span>
                <p className="text-slate-900 font-semibold">{selectedEnquiry.email || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Phone Number</span>
                <p className="text-slate-900 font-mono font-semibold">{selectedEnquiry.phone || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Requested Course / Service</span>
                <p className="text-slate-900 font-semibold">{selectedEnquiry.course || selectedEnquiry.service || 'General'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Submission Timestamp</span>
                <p className="text-slate-900 font-semibold">{selectedEnquiry.submittedAt || 'N/A'}</p>
              </div>
            </div>

            {/* Message / Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Message / Full Application Details</span>
              <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message || 'No additional message provided.'}
              </p>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-bold">Status:</span>
                <select
                  value={selectedEnquiry.status || 'new'}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(selectedEnquiry.phone)}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, we received your enquiry at Yukti Software.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
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
