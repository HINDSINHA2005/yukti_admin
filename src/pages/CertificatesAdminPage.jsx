import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Briefcase, 
  FileText, 
  Building2, 
  Plus, 
  ShieldCheck, 
  Printer, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Users,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  createCertificateDoc, 
  getCertificates, 
  deleteCertificateDoc 
} from '../services/adminService';

export default function CertificatesAdminPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [docType, setDocType] = useState('training_certificate');
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    college: '',
    title: 'Java Full Stack Development & Microservices',
    duration: '6 Months (Jan 2026 – Jun 2026)',
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Grade A+ (Distinction)',
    skills: 'Core Java, Spring Boot 3, React.js, Hibernate, Microservices, Docker, MySQL',
    projectTitle: 'Enterprise Cloud Architecture Project',
    stipend: 'Performance Based (INR 10,000/mo)',
    startDate: new Date().toISOString().split('T')[0],
    instructor: 'Sanjay Sharma (Lead Enterprise Architect)',
    authorizedSignatory: 'Director of Academic Affairs'
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await getCertificates();
      setCertificates(list);
    } catch (err) {
      console.error('Error loading certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setDocType(type);
    if (type === 'training_certificate') {
      setFormData(prev => ({
        ...prev,
        title: 'Java Full Stack Development & Microservices',
        grade: 'Grade A+ (Distinction)',
        skills: 'Core Java, Spring Boot 3, React.js, Hibernate, Microservices, Docker, MySQL'
      }));
    } else if (type === 'internship_certificate') {
      setFormData(prev => ({
        ...prev,
        title: 'Full Stack Web Engineering Internship',
        grade: 'Outstanding Performance (Grade A)',
        skills: 'React.js, Node.js, Express, MongoDB, REST APIs, Git & CI/CD'
      }));
    } else if (type === 'internship_offer') {
      setFormData(prev => ({
        ...prev,
        title: 'Software Development Intern',
        stipend: 'Performance-linked stipend + PPO Opportunity',
        duration: '3 Months (Full-Time / Hybrid)'
      }));
    } else if (type === 'mou') {
      setFormData(prev => ({
        ...prev,
        studentName: 'RKGIT / Sharda University / Galgotias',
        title: 'Academic & Industrial Training Collaboration MoU',
        duration: '3 Years (2026 – 2029)',
        projectTitle: 'Joint Hackathons, Faculty Workshops & Campus Placement Drives'
      }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.title.trim()) {
      alert('Please enter Student / Institution Name and Program Title');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCertificateDoc({
        type: docType,
        ...formData
      });

      setPreviewDoc(result);
      setIsSuccess(true);
      await loadData();
      setActiveTab('preview');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating document:', err);
      alert('Failed to generate document. Please verify Firebase connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (certId) => {
    if (window.confirm(`Are you sure you want to revoke / delete certificate "${certId}"?`)) {
      await deleteCertificateDoc(certId);
      await loadData();
      if (previewDoc?.id === certId) setPreviewDoc(null);
    }
  };

  const copyVerifyLink = (id) => {
    const url = `https://yuktisoftware.com/verify?id=${encodeURIComponent(id)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCerts = certificates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.studentName || '').toLowerCase().includes(q) ||
      (c.id || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q) ||
      (c.college || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Official Credential & Document Studio</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Certificate & Offer Letter Generator
          </h2>
          <p className="text-xs text-slate-500">
            Generate, authenticate and save certificates, offer letters, and institutional MoUs directly to Firebase.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-bold">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-brand-600 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Create Document
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-brand-600 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Issued Registry ({certificates.length})
          </button>
          {previewDoc && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-brand-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Print Preview
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CREATE DOCUMENT FORM */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Document Type Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Document Type</h3>
            
            <div className="space-y-2">
              {[
                { id: 'training_certificate', title: '1. Course Training Certificate', desc: 'Issued upon successful course completion with performance grade.', icon: Award },
                { id: 'internship_certificate', title: '2. Internship Completion Certificate', desc: 'Verified industrial internship credential with live capstone project.', icon: Briefcase },
                { id: 'internship_offer', title: '3. Internship Offer Letter', desc: 'Formal offer letter with start date, stipend, and terms.', icon: FileText },
                { id: 'mou', title: '4. Institutional / College MoU', desc: 'Memorandum of Understanding for university partnerships & workshops.', icon: Building2 },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-50/80 border-brand-500 shadow-sm ring-2 ring-brand-500/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
              Document & Candidate Details
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {docType === 'mou' ? 'Partner College / Institution' : 'Student / Candidate Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / University (Optional)
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="e.g. Galgotias University, Greater Noida"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {docType === 'internship_offer' ? 'Internship Role / Designation' : 'Course / Program Title'} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Java Full Stack Development"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration & Batch Timeline
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 6 Months (Jan 2026 – Jun 2026)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {docType !== 'internship_offer' && docType !== 'mou' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Performance Evaluation / Grade
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder="e.g. Grade A+ (Distinction)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {docType === 'internship_offer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Stipend / Compensation
                    </label>
                    <input
                      type="text"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      placeholder="e.g. Performance Based + Certificate"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Joining / Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Stack / Modules (Comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. Core Java, Spring Boot 3, React.js, Hibernate, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Capstone Project Title / Deliverable
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Enterprise Multi-Vendor Cloud Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty / Mentor Name
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorized Signatory
                  </label>
                  <input
                    type="text"
                    name="authorizedSignatory"
                    value={formData.authorizedSignatory}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Document & Save to Firebase</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ISSUED CERTIFICATES REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, ID or college..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Document</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Certificate ID</th>
                    <th className="p-3.5">Student / Institution</th>
                    <th className="p-3.5">Course / Role</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Grade</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredCerts.length > 0 ? (
                    filteredCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-600">
                          {cert.id || cert.certId}
                        </td>
                        <td className="p-3.5">
                          <p className="font-extrabold text-slate-900">{cert.studentName}</p>
                          {cert.college && <p className="text-[10px] text-slate-400">{cert.college}</p>}
                        </td>
                        <td className="p-3.5 max-w-xs truncate font-medium">
                          {cert.title}
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {cert.issueDate || '2026-06-30'}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            {cert.grade || 'Verified'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => copyVerifyLink(cert.id)}
                            title="Copy Public Verification Link"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-all cursor-pointer"
                          >
                            {copiedId === cert.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setPreviewDoc(cert);
                              setActiveTab('preview');
                            }}
                            title="View & Print Certificate"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-all cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            title="Revoke / Delete"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 text-xs">
                        No certificates found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRINTABLE TEMPLATE PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && previewDoc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-900">
                Generated & Saved in Firebase: <strong className="font-mono text-brand-600">{previewDoc.id}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyVerifyLink(previewDoc.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all flex items-center space-x-1"
              >
                {copiedId === previewDoc.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Verify Link</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black shadow-md transition-all flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          {/* Official Printable Certificate Template */}
          <div className="p-8 sm:p-14 bg-white text-slate-900 rounded-3xl border-8 border-slate-900 shadow-2xl relative overflow-hidden space-y-8 font-serif">
            
            {/* Corner Decorative Borders */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-brand-600" />
            <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-brand-600" />
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-brand-600" />
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-brand-600" />

            {/* Header with Logo */}
            <div className="text-center space-y-2 border-b-2 border-slate-200 pb-6">
              <img src="/yukti-logo.svg" alt="Yukti Software" className="h-12 w-auto mx-auto" />
              <h2 className="text-3xl font-black tracking-wider text-slate-900 uppercase font-sans">YUKTI SOFTWARE</h2>
              <p className="text-xs text-slate-500 font-sans tracking-widest uppercase">Center for Advanced Software Architecture & Enterprise Training</p>
              <p className="text-[11px] text-slate-400 font-sans">Greater Noida, National Capital Region (NCR), India</p>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-3 pt-2">
              <span className="text-xs font-black tracking-widest text-brand-600 uppercase font-sans px-4 py-1 rounded-full bg-brand-50 border border-brand-200 inline-block">
                {previewDoc.type === 'internship_offer' ? 'Official Offer Letter' : 
                 previewDoc.type === 'mou' ? 'Institutional Partnership Agreement' : 
                 previewDoc.type === 'internship_certificate' ? 'Certificate of Industrial Internship' : 'Certificate of Excellence & Completion'}
              </span>

              <p className="text-xs italic text-slate-500 pt-2">This is to proudly certify that</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-brand-500 underline-offset-8">
                {previewDoc.studentName}
              </h1>
              {previewDoc.college && (
                <p className="text-sm font-sans font-bold text-slate-600 pt-1">
                  From {previewDoc.college}
                </p>
              )}
            </div>

            {/* Body Description */}
            <div className="text-center max-w-2xl mx-auto space-y-3 font-sans text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
              <p>
                has successfully completed the comprehensive professional program in{' '}
                <strong className="text-slate-950 font-black">{previewDoc.title}</strong>{' '}
                held during <strong className="text-slate-950">{previewDoc.duration || '2026'}</strong> and evaluated with{' '}
                <strong className="text-emerald-700 font-black">{previewDoc.grade || 'Grade A'}</strong>.
              </p>

              {previewDoc.skills && (
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Mastered Core Competencies:</span> {previewDoc.skills}
                </p>
              )}

              {previewDoc.projectTitle && (
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Live Capstone Architecture:</span> {previewDoc.projectTitle}
                </p>
              )}
            </div>

            {/* Certificate Footer & Signatures */}
            <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-3 gap-4 items-center text-center font-sans">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900">{previewDoc.instructor || 'Lead Technical Mentor'}</p>
                <p className="text-[10px] text-slate-500">Technical Mentor</p>
              </div>

              <div className="space-y-1">
                <div className="w-14 h-14 mx-auto rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center p-1">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <p className="text-[9px] font-mono font-bold text-slate-500">{previewDoc.id}</p>
                <p className="text-[8px] text-emerald-600 font-bold uppercase">Online Authenticated</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900">{previewDoc.authorizedSignatory || 'Director of Academics'}</p>
                <p className="text-[10px] text-slate-500">Authorized Signatory</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
