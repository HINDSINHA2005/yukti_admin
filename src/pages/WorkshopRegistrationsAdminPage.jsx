import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Award, 
  ShieldCheck, 
  Printer, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  X,
  Edit,
  Hash
} from 'lucide-react';
import { 
  getWorkshopRegistrations, 
  updateWorkshopRegistration, 
  deleteWorkshopRegistration, 
  generateWorkshopCertificate 
} from '../services/adminService';

// Authentic Greek Key Geometric Corner Ornament matching Official Certificate
function GreekCorner({ className = "w-10 h-10 sm:w-16 sm:h-16" }) {
  return (
    <svg 
      viewBox="0 0 54 54" 
      className={className} 
      fill="none" 
      stroke="#0c1b33" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
    >
      <path d="M 2 54 L 2 2 L 54 2" />
      <path d="M 8 54 L 8 8 L 54 8" />
      <path d="M 14 54 L 14 20 L 34 20 L 34 14 L 54 14" />
      <path d="M 20 54 L 20 26 L 28 26 L 28 20 L 54 20" />
      <path d="M 8 26 L 14 26" />
      <path d="M 28 8 L 28 14" />
    </svg>
  );
}

export default function WorkshopRegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('ALL');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, ISSUED, PENDING
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, name_asc, college_asc

  // Modals & Active Selections
  const [previewCert, setPreviewCert] = useState(null);
  const [detailReg, setDetailReg] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Manual Registration Form State
  const [manualForm, setManualForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    college: 'Galgotias University, Greater Noida',
    course: 'B.Tech',
    section: 'CSE-A',
    passingYear: '2026',
    rollNumber: '',
    workshopName: 'Full Stack Web Development with React & Node.js',
    workshopDate: new Date().toISOString().split('T')[0],
    feedback: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await getWorkshopRegistrations();
      setRegistrations(list);
    } catch (err) {
      console.error('Error fetching workshop registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Sort Logic
  const uniqueWorkshops = Array.from(new Set(registrations.map(r => r.workshopName).filter(Boolean))).sort();
  const uniqueColleges = Array.from(new Set(registrations.map(r => r.college).filter(Boolean))).sort();

  const filteredRegistrations = registrations.filter(reg => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = !query || (
      (reg.studentName && reg.studentName.toLowerCase().includes(query)) ||
      (reg.rollNumber && reg.rollNumber.toLowerCase().includes(query)) ||
      (reg.email && reg.email.toLowerCase().includes(query)) ||
      (reg.phone && reg.phone.includes(query)) ||
      (reg.college && reg.college.toLowerCase().includes(query)) ||
      (reg.workshopName && reg.workshopName.toLowerCase().includes(query)) ||
      (reg.registrationId && reg.registrationId.toLowerCase().includes(query)) ||
      (reg.certificateId && reg.certificateId.toLowerCase().includes(query))
    );

    const matchWorkshop = selectedWorkshop === 'ALL' || reg.workshopName === selectedWorkshop;
    const matchCollege = selectedCollege === 'ALL' || reg.college === selectedCollege;
    const matchStatus = 
      selectedStatus === 'ALL' ? true :
      selectedStatus === 'ISSUED' ? !!reg.certificateIssued :
      selectedStatus === 'PENDING' ? !reg.certificateIssued : true;

    return matchSearch && matchWorkshop && matchCollege && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'date_desc') {
      return (b.workshopDate || b.submittedAt || '').localeCompare(a.workshopDate || a.submittedAt || '');
    }
    if (sortBy === 'date_asc') {
      return (a.workshopDate || a.submittedAt || '').localeCompare(b.workshopDate || b.submittedAt || '');
    }
    if (sortBy === 'name_asc') {
      return (a.studentName || '').localeCompare(b.studentName || '');
    }
    if (sortBy === 'college_asc') {
      return (a.college || '').localeCompare(b.college || '');
    }
    return 0;
  });

  // KPI Metrics
  const totalRegistrations = registrations.length;
  const totalWorkshops = uniqueWorkshops.length;
  const totalColleges = uniqueColleges.length;
  const certificatesIssuedCount = registrations.filter(r => r.certificateIssued).length;
  const certificatesPendingCount = totalRegistrations - certificatesIssuedCount;

  // Single Certificate Generation
  const handleGenerateCertificate = async (reg) => {
    try {
      const generated = await generateWorkshopCertificate(reg);
      setPreviewCert(generated);
      await loadData();
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      alert('Certificate generation failed: ' + err.message);
    }
  };

  // Batch Certificate Generation for all filtered pending entries
  const handleBatchGenerate = async () => {
    const pendingList = filteredRegistrations.filter(r => !r.certificateIssued);
    if (pendingList.length === 0) {
      alert('No pending students found in the current view.');
      return;
    }

    if (!window.confirm(`Generate certificates for ${pendingList.length} pending registered students in one click?`)) {
      return;
    }

    setIsBatchGenerating(true);
    let successCount = 0;

    for (const reg of pendingList) {
      try {
        await generateWorkshopCertificate(reg);
        successCount++;
      } catch (err) {
        console.warn(`Failed for ${reg.studentName}:`, err);
      }
    }

    setIsBatchGenerating(false);
    await loadData();
    alert(`Successfully generated ${successCount} workshop certificates!`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No records to export.');
      return;
    }

    const headers = [
      'Registration Ref ID',
      'Student Name',
      'Roll Number',
      'College / University',
      'Degree Program',
      'Branch / Section',
      'Passing Year',
      'Email',
      'Phone',
      'Workshop Topic',
      'Workshop Date',
      'Certificate Issued',
      'Certificate ID',
      'Online Verification URL',
      'Submission Timestamp'
    ];

    const rows = filteredRegistrations.map(r => [
      `"${r.registrationId || r.id || ''}"`,
      `"${r.studentName || ''}"`,
      `"${r.rollNumber || ''}"`,
      `"${r.college || ''}"`,
      `"${r.course || ''}"`,
      `"${r.section || ''}"`,
      `"${r.passingYear || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.workshopName || ''}"`,
      `"${r.workshopDate || ''}"`,
      r.certificateIssued ? 'YES' : 'NO',
      `"${r.certificateId || ''}"`,
      r.certificateId ? `"https://www.yuktisoftware.com/verify/?id=${r.certificateId}"` : '""',
      `"${r.submittedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Yukti_Workshop_Roster_${(selectedWorkshop !== 'ALL' ? selectedWorkshop : 'All').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete registration
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete registration record for "${name}"?`)) {
      await deleteWorkshopRegistration(id);
      await loadData();
      if (detailReg?.id === id) setDetailReg(null);
    }
  };

  // Copy Verification URL
  const handleCopyLink = (certId) => {
    const url = `https://www.yuktisoftware.com/verify/?id=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Print Isolated Certificate PDF
  const handlePrintCertificate = () => {
    const printArea = document.getElementById('official-certificate-print-area');
    if (!printArea) {
      window.print();
      return;
    }

    // Remove any stale print iframe
    const prevIframe = document.getElementById('workshop-certificate-print-frame');
    if (prevIframe) {
      prevIframe.remove();
    }

    // Grab all stylesheets and compiled styles from current document
    const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    // Create properly dimensioned invisible iframe
    const printIframe = document.createElement('iframe');
    printIframe.id = 'workshop-certificate-print-frame';
    printIframe.style.position = 'fixed';
    printIframe.style.top = '0';
    printIframe.style.left = '0';
    printIframe.style.width = '100vw';
    printIframe.style.height = '100vh';
    printIframe.style.border = 'none';
    printIframe.style.zIndex = '-99999';
    printIframe.style.opacity = '0';
    printIframe.style.pointerEvents = 'none';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Yukti_Software_Certificate_${(previewCert?.studentName || 'Participant').replace(/\s+/g, '_')}_${previewCert?.id || previewCert?.certId || ''}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          ${headStyles}
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm 4mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              width: 100% !important;
              min-height: 100% !important;
              font-family: serif !important;
            }
            body {
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
              padding: 4mm !important;
              background-color: #ffffff !important;
            }
            #official-certificate-print-area {
              display: block !important;
              width: 100% !important;
              max-width: 800px !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              border: 3.5px solid #0c1b33 !important;
              background: #ffffff !important;
              color: #0c1b33 !important;
              visibility: visible !important;
            }
            #official-certificate-print-area * {
              visibility: visible !important;
            }
          </style>
        </head>
        <body class="bg-white text-[#0c1b33]">
          ${printArea.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    const doPrint = () => {
      setTimeout(() => {
        try {
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        } catch (err) {
          console.error('Print iframe trigger error:', err);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 4000);
        }
      }, 350);
    };

    // Ensure all images are loaded before printing
    const imgs = printIframe.contentDocument ? Array.from(printIframe.contentDocument.images) : [];
    if (imgs.length === 0) {
      doPrint();
    } else {
      let loaded = 0;
      let fired = false;
      const onDone = () => {
        loaded++;
        if (loaded >= imgs.length && !fired) {
          fired = true;
          doPrint();
        }
      };
      imgs.forEach((img) => {
        if (img.complete) {
          onDone();
        } else {
          img.addEventListener('load', onDone);
          img.addEventListener('error', onDone);
        }
      });
      setTimeout(() => {
        if (!fired) {
          fired = true;
          doPrint();
        }
      }, 1500);
    }
  };

  // Format clean phone for WhatsApp
  const formatWhatsApp = (phone = '') => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 ? '91' + cleaned : cleaned;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & KPI METRICS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Workshop Registry & Accreditation</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-2xs">
                  Active
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage registered college workshop attendees, sort by campus & issue verifiable credentials
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 shadow-2xs transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-600' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-bold shadow-2xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Roster (CSV)</span>
          </button>

          <button
            onClick={handleBatchGenerate}
            disabled={isBatchGenerating || certificatesPendingCount === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            {isBatchGenerating ? (
              <>
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Batch Generate Certs ({certificatesPendingCount})</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white text-xs font-extrabold shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attendee</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Registered Students</span>
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalRegistrations}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Total workshop attendees recorded</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Active Workshops</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalWorkshops}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Distinct technical topics conducted</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Partner Campuses</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalColleges}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Universities & colleges participating</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Certificates Issued</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {certificatesIssuedCount} <span className="text-xs text-slate-400 font-normal">/ {totalRegistrations}</span>
          </p>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
            {certificatesPendingCount} pending issuance
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SORT CONTROLS BAR */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, email, phone, college..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Workshop Filter */}
          <div className="w-full lg:w-64">
            <select
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Workshops ({totalWorkshops})</option>
              {uniqueWorkshops.map((w, idx) => (
                <option key={idx} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* College Filter */}
          <div className="w-full lg:w-64">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Colleges ({totalColleges})</option>
              {uniqueColleges.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ISSUED">Certificate Issued</option>
              <option value="PENDING">Pending Cert</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full lg:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="college_asc">College: A to Z</option>
            </select>
          </div>

        </div>

        {/* Active Filters Pill Bar */}
        {(selectedWorkshop !== 'ALL' || selectedCollege !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400 font-bold">Active Filters:</span>
            {selectedWorkshop !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold">
                <span>Workshop: {selectedWorkshop}</span>
                <button onClick={() => setSelectedWorkshop('ALL')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCollege !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                <span>College: {selectedCollege}</span>
                <button onClick={() => setSelectedCollege('ALL')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                <span>Status: {selectedStatus}</span>
                <button onClick={() => setSelectedStatus('ALL')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedWorkshop('ALL');
                setSelectedCollege('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="text-rose-600 hover:underline font-bold ml-1 cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ROBUST RESPONSIVE REGISTERED STUDENTS TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs table-fixed min-w-[950px]">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-[26%]">Student & Academic Track</th>
                <th className="px-4 py-3 w-[24%]">Workshop & Date</th>
                <th className="px-3 py-3 w-[20%]">College / University</th>
                <th className="px-3 py-3 w-[15%] text-center">Certificate Status</th>
                <th className="px-3 py-3 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-slate-400 space-y-2">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No workshop registrations found.</p>
                    <p className="text-xs text-slate-400">
                      When students register via <code className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">/workshop-registration/</code> on the main site, they will appear here in real time.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const cleanPhone = formatWhatsApp(reg.phone);
                  const isCertIssued = !!reg.certificateIssued;

                  return (
                    <tr 
                      key={reg.id || reg.registrationId} 
                      className="hover:bg-brand-50/40 transition-colors group"
                    >
                      
                      {/* Column 1: Student & Academic Track */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-brand-700 transition-colors">
                              {reg.studentName}
                            </span>
                            {reg.rollNumber && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {reg.rollNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-slate-500 text-[11px]">
                            {reg.course && (
                              <span className="font-bold text-slate-700">
                                {reg.course} {reg.section ? `(${reg.section})` : ''}
                              </span>
                            )}
                            {reg.passingYear && (
                              <>
                                <span>•</span>
                                <span className="text-slate-500">Class of {reg.passingYear}</span>
                              </>
                            )}
                          </div>

                          {/* Contact Shortcuts */}
                          <div className="flex items-center space-x-2 pt-0.5 text-[11px]">
                            {reg.phone && (
                              <a
                                href={`tel:${reg.phone}`}
                                className="font-mono text-slate-600 hover:text-brand-600 font-bold"
                              >
                                {reg.phone}
                              </a>
                            )}
                            {reg.email && reg.phone && <span>•</span>}
                            {reg.email && (
                              <a
                                href={`mailto:${reg.email}`}
                                className="hover:text-brand-600 truncate max-w-[150px] text-slate-500"
                                title={reg.email}
                              >
                                {reg.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Workshop & Date */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1">
                          <p className="text-slate-900 font-bold text-xs line-clamp-2" title={reg.workshopName}>
                            {reg.workshopName}
                          </p>
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-medium">
                            <Calendar className="w-3 h-3 text-brand-600 shrink-0" />
                            <span>
                              {reg.workshopDate ? new Date(reg.workshopDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                          {reg.registrationId && (
                            <p className="text-[9px] font-mono text-slate-400">
                              Ref: {reg.registrationId}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Column 3: College / University */}
                      <td className="px-3 py-3.5 align-top">
                        <div className="space-y-1">
                          <div className="flex items-start space-x-1 text-slate-800 font-bold text-xs">
                            <Building2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-tight" title={reg.college}>
                              {reg.college}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400">
                            Registered: {reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Online'}
                          </p>
                        </div>
                      </td>

                      {/* Column 4: Certificate Status & Verification Link */}
                      <td className="px-3 py-3.5 align-top text-center">
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          {isCertIssued ? (
                            <>
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-300">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Verified Cert</span>
                              </span>
                              <span className="font-mono text-[9px] font-bold text-slate-600 truncate max-w-[110px]" title={reg.certificateId}>
                                {reg.certificateId}
                              </span>
                              <div className="flex items-center space-x-1 text-[10px]">
                                <button
                                  onClick={() => handleCopyLink(reg.certificateId)}
                                  className="text-brand-600 hover:underline font-bold inline-flex items-center space-x-0.5 cursor-pointer"
                                  title="Copy Verification Link"
                                >
                                  {copiedId === reg.certificateId ? (
                                    <span className="text-emerald-600">Copied!</span>
                                  ) : (
                                    <>
                                      <Copy className="w-2.5 h-2.5" />
                                      <span>Copy URL</span>
                                    </>
                                  )}
                                </button>
                                <span>•</span>
                                <a
                                  href={`https://www.yuktisoftware.com/verify/?id=${encodeURIComponent(reg.certificateId)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-500 hover:text-brand-600 inline-flex items-center space-x-0.5"
                                  title="Verify Live"
                                >
                                  <span>Verify</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-300">
                                <AlertCircle className="w-2.5 h-2.5" />
                                <span>Pending Cert</span>
                              </span>
                              <button
                                onClick={() => handleGenerateCertificate(reg)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <Award className="w-3 h-3" />
                                <span>Generate</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Actions */}
                      <td className="px-3 py-3.5 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1 shrink-0">
                          
                          {/* 1-Click WhatsApp */}
                          {reg.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${reg.studentName}, thank you for attending the Yukti Software workshop on "${reg.workshopName}". Here are your session details and certificate verification access!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="shrink-0 p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* 1-Click Email */}
                          {reg.email && (
                            <a
                              href={`mailto:${reg.email}?subject=${encodeURIComponent(`Yukti Software - Workshop Attendance & Certificate: ${reg.workshopName}`)}`}
                              title="Send Email"
                              className="shrink-0 p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* View Certificate (If Generated) */}
                          {isCertIssued && (
                            <button
                              onClick={() => {
                                setPreviewCert({
                                  id: reg.certificateId,
                                  certId: reg.certificateId,
                                  studentName: reg.studentName,
                                  college: reg.college,
                                  title: reg.workshopName,
                                  issueDate: reg.workshopDate,
                                  type: 'workshop_certificate',
                                  subtitle: 'OF WORKSHOP PARTICIPATION & COMPLETION',
                                  rollNumber: reg.rollNumber,
                                  description: `This is to certify that ${reg.studentName} from ${reg.college} (${reg.course || 'Degree Program'}, Class of ${reg.passingYear || '2026'}) has actively participated and successfully completed the Hands-on Industrial Workshop on "${reg.workshopName}" conducted by Yukti Software on ${reg.workshopDate}. During this workshop, the participant demonstrated keen learning, analytical skills, and exemplary technical engagement.`,
                                  ceoSignatureUrl: typeof localStorage !== 'undefined' ? localStorage.getItem('yukti_global_ceo_sign') : '',
                                  ctoSignatureUrl: typeof localStorage !== 'undefined' ? localStorage.getItem('yukti_global_cto_sign') : ''
                                });
                              }}
                              title="View & Print Official Certificate"
                              className="shrink-0 p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* View Full Form Details */}
                          <button
                            onClick={() => setDetailReg(reg)}
                            title="Open Full Registration Details"
                            className="shrink-0 p-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(reg.id, reg.studentName)}
                            title="Delete Registration"
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
      {/* 4. MODAL: OFFICIAL CERTIFICATE PREVIEW & DIRECT PDF PRINT */}
      {/* ========================================================================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Workshop Certificate Preview
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {previewCert.id || previewCert.certId}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Canvas Matching Official Scan PDF */}
            <div 
              id="official-certificate-print-area"
              className="w-full max-w-[850px] mx-auto bg-white text-[#0c1b33] p-6 sm:p-12 relative overflow-hidden shadow-xl rounded-2xl border-[3px] border-[#0c1b33] font-serif select-none"
              style={{ minHeight: '980px' }}
            >
              {/* Inner Border */}
              <div className="absolute inset-3 border border-[#0c1b33] pointer-events-none" />

              {/* 4 Corner Geometric Greek Key Ornaments */}
              <div className="absolute top-4 left-4"><GreekCorner className="w-10 h-10 sm:w-14 sm:h-14" /></div>
              <div className="absolute top-4 right-4 rotate-90"><GreekCorner className="w-10 h-10 sm:w-14 sm:h-14" /></div>
              <div className="absolute bottom-4 right-4 rotate-180"><GreekCorner className="w-10 h-10 sm:w-14 sm:h-14" /></div>
              <div className="absolute bottom-4 left-4 -rotate-90"><GreekCorner className="w-10 h-10 sm:w-14 sm:h-14" /></div>

              {/* Subtle Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                <div className="text-center transform -rotate-12 space-y-16">
                  <p className="text-6xl sm:text-7xl font-serif font-black tracking-widest uppercase">YUKTI SOFTWARE</p>
                  <p className="text-6xl sm:text-7xl font-serif font-black tracking-widest uppercase">YUKTI SOFTWARE</p>
                </div>
              </div>

              {/* Certificate Inner Content */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-7 text-center pt-2 pb-2">
                
                {/* Logo */}
                <div className="pt-2">
                  <img 
                    src="/yukti-logo.svg" 
                    alt="Yukti Software" 
                    className="h-14 sm:h-18 w-auto mx-auto object-contain" 
                  />
                </div>

                {/* Header */}
                <div className="space-y-1 pt-2">
                  <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-widest text-[#0c1b33] uppercase">
                    CERTIFICATE
                  </h1>
                  <p className="text-xs sm:text-sm font-serif font-bold tracking-[0.25em] text-[#0c1b33] uppercase">
                    OF WORKSHOP PARTICIPATION & COMPLETION
                  </p>
                </div>

                {/* Presentation Line */}
                <p className="text-xs sm:text-sm font-serif italic text-slate-800">
                  This Certificate is Awarded to
                </p>

                {/* Recipient */}
                <div className="py-1">
                  <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-widest text-[#0c1b33] uppercase italic">
                    {previewCert.studentName || 'PARTICIPANT NAME'}
                  </h2>
                  {previewCert.college && (
                    <p className="text-xs font-sans font-semibold text-slate-600 mt-1">
                      {previewCert.college}
                    </p>
                  )}
                </div>

                {/* Body Text */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                  <p className="text-xs sm:text-[13px] font-serif text-slate-800 leading-relaxed text-center sm:text-justify font-medium">
                    {previewCert.description}
                  </p>
                </div>

                {/* Signatories & Real QR Code */}
                <div className="pt-6 sm:pt-10 grid grid-cols-3 gap-2 sm:gap-4 items-end px-2 sm:px-6">
                  
                  {/* Left: CEO */}
                  <div className="text-center space-y-1">
                    <div className="h-12 sm:h-14 flex items-end justify-center mb-1">
                      {previewCert.ceoSignatureUrl ? (
                        <img 
                          src={previewCert.ceoSignatureUrl} 
                          alt="CEO Signature" 
                          className="max-h-12 sm:max-h-14 w-auto object-contain" 
                        />
                      ) : (
                        <span className="font-serif italic text-xs text-slate-400">Signed</span>
                      )}
                    </div>
                    <div className="w-32 sm:w-40 border-t border-[#0c1b33] mx-auto pt-1">
                      <p className="text-[10px] sm:text-xs font-serif font-black tracking-wider text-[#0c1b33] uppercase">
                        MANISHA KUMARI
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-sans text-slate-600">
                        Founder & CEO
                      </p>
                    </div>
                  </div>

                  {/* Center: QR Code */}
                  <div className="text-center space-y-1">
                    <div className="inline-block p-1 bg-white border border-slate-300 rounded-lg shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://www.yuktisoftware.com/verify/')}`}
                        alt="Verify QR Code"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                      />
                    </div>
                    <p className="text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                      Scan to Verify
                    </p>
                  </div>

                  {/* Right: CTO */}
                  <div className="text-center space-y-1">
                    <div className="h-12 sm:h-14 flex items-end justify-center mb-1">
                      {previewCert.ctoSignatureUrl ? (
                        <img 
                          src={previewCert.ctoSignatureUrl} 
                          alt="CTO Signature" 
                          className="max-h-12 sm:max-h-14 w-auto object-contain" 
                        />
                      ) : (
                        <span className="font-serif italic text-xs text-slate-400">Signed</span>
                      )}
                    </div>
                    <div className="w-32 sm:w-40 border-t border-[#0c1b33] mx-auto pt-1">
                      <p className="text-[10px] sm:text-xs font-serif font-black tracking-wider text-[#0c1b33] uppercase">
                        MITHILESH KUMAR
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-sans text-slate-600">
                        CTO
                      </p>
                    </div>
                  </div>

                </div>

                {/* Bottom Metadata */}
                <div className="pt-6 flex items-center justify-between text-[10px] font-sans px-2 sm:px-6 text-slate-700">
                  <span>
                    Issued on: <strong className="text-[#0c1b33] font-bold">{previewCert.issueDate}</strong>
                  </span>
                  <span>
                    Certificate ID: <strong className="font-mono text-[#0c1b33] font-bold">{previewCert.id || previewCert.certId}</strong>
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: FULL REGISTRATION DETAILS */}
      {/* ========================================================================= */}
      {detailReg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Workshop Registration Full Record
                </h3>
              </div>
              <button
                onClick={() => setDetailReg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Name</span>
                  <span className="font-extrabold text-slate-900 text-sm">{detailReg.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll Number</span>
                  <span className="font-mono font-bold text-slate-800">{detailReg.rollNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <span className="font-bold text-slate-800">{detailReg.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">WhatsApp Number</span>
                  <span className="font-bold text-slate-800">{detailReg.phone}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">College / University</span>
                  <span className="font-extrabold text-slate-900">{detailReg.college}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Degree / Course</span>
                    <span className="font-bold text-slate-800">{detailReg.course}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Section / Branch</span>
                    <span className="font-bold text-slate-800">{detailReg.section || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Passing Year</span>
                    <span className="font-bold text-slate-800">{detailReg.passingYear}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-1.5">
                <span className="text-[10px] font-bold text-brand-700 uppercase block">Workshop Track</span>
                <p className="font-extrabold text-brand-900">{detailReg.workshopName}</p>
                <p className="text-[11px] text-brand-700">Date: {detailReg.workshopDate}</p>
              </div>

              {detailReg.feedback && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Feedback / Remarks</span>
                  <p className="text-slate-700 italic">"{detailReg.feedback}"</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              {!detailReg.certificateIssued && (
                <button
                  onClick={() => {
                    handleGenerateCertificate(detailReg);
                    setDetailReg(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Generate Certificate</span>
                </button>
              )}
              <button
                onClick={() => setDetailReg(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ADD MANUAL REGISTRATION */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Add Manual Workshop Attendee
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const { addItem } = await import('../services/adminService');
                  const regId = `REG-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`;
                  await addItem('workshop_registrations', {
                    ...manualForm,
                    registrationId: regId,
                    submittedAt: new Date().toISOString(),
                    status: 'registered',
                    certificateIssued: false,
                    certificateId: null
                  });
                  setIsAddModalOpen(false);
                  await loadData();
                  alert('Attendee added successfully!');
                } catch (err) {
                  alert('Failed to add attendee: ' + err.message);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.studentName}
                  onChange={(e) => setManualForm(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={manualForm.email}
                    onChange={(e) => setManualForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="priya@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phone}
                    onChange={(e) => setManualForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  value={manualForm.college}
                  onChange={(e) => setManualForm(prev => ({ ...prev, college: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={manualForm.course}
                    onChange={(e) => setManualForm(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={manualForm.section}
                    onChange={(e) => setManualForm(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    value={manualForm.rollNumber}
                    onChange={(e) => setManualForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workshop Topic</label>
                  <input
                    type="text"
                    required
                    value={manualForm.workshopName}
                    onChange={(e) => setManualForm(prev => ({ ...prev, workshopName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={manualForm.workshopDate}
                    onChange={(e) => setManualForm(prev => ({ ...prev, workshopDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold shadow-md"
                >
                  Save Attendee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
