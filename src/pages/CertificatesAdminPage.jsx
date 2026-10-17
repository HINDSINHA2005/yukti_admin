import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  Upload,
  Image as ImageIcon,
  PenTool,
  RefreshCw,
  X,
  BookOpen
} from 'lucide-react';
import { 
  createCertificateDoc, 
  getCertificates, 
  deleteCertificateDoc 
} from '../services/adminService';

// Authentic Greek Key Geometric Corner Ornament
function GreekCorner({ className = "w-12 h-12 sm:w-16 sm:h-16" }) {
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

export default function CertificatesAdminPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [docType, setDocType] = useState('internship_certificate');
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Global Signatures Stored in localStorage
  const [ceoSignature, setCeoSignature] = useState(() => {
    return localStorage.getItem('yukti_global_ceo_sign') || '';
  });
  const [ctoSignature, setCtoSignature] = useState(() => {
    return localStorage.getItem('yukti_global_cto_sign') || '';
  });

  const ceoInputRef = useRef(null);
  const ctoInputRef = useRef(null);

  // Form State matching Official Certificate PDF
  const [formData, setFormData] = useState({
    certId: `20260615${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    studentName: 'Ashu Rai',
    college: 'Galgotias University, Greater Noida',
    title: 'Associate Developer Intern',
    startDate: '15th of June 2026',
    endDate: '13th of July 2026',
    issueDate: '14-07-2026',
    duration: '1 Month (June 2026 – July 2026)',
    grade: 'Commendable Performance & Growth',
    skills: 'Full Stack Development, React.js, Node.js, Express, MongoDB, REST APIs, Git',
    projectTitle: 'Enterprise Software & API Modules',
    description: 'This is to certify that Ashu Rai has successfully completed the internship program at Yukti Software as an Associate Developer Intern from 15th of June 2026 to 13th of July 2026. During this period, she demonstrated dedication, professionalism, and a strong willingness to learn. He contributed to various projects and tasks, showing commendable growth and collaboration.',
    ceoName: 'MANISHA KUMARI',
    ceoTitle: 'Founder & CEO',
    ctoName: 'MITHILESH KUMAR',
    ctoTitle: 'CTO'
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

  // Auto-update paragraph text when name, role, or dates change
  const syncDescription = (studentName, title, startDate, endDate) => {
    const name = studentName || formData.studentName || 'Candidate';
    const role = title || formData.title || 'Associate Developer Intern';
    const sDate = startDate || formData.startDate || '15th of June 2026';
    const eDate = endDate || formData.endDate || '13th of July 2026';
    
    return `This is to certify that ${name} has successfully completed the internship program at Yukti Software as an ${role} from ${sDate} to ${eDate}. During this period, she demonstrated dedication, professionalism, and a strong willingness to learn. He contributed to various projects and tasks, showing commendable growth and collaboration.`;
  };

  const handleSignatureUpload = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      if (type === 'ceo') {
        setCeoSignature(base64Url);
        localStorage.setItem('yukti_global_ceo_sign', base64Url);
      } else {
        setCtoSignature(base64Url);
        localStorage.setItem('yukti_global_cto_sign', base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (type) => {
    setDocType(type);
    if (type === 'internship_certificate') {
      setFormData(prev => ({
        ...prev,
        title: 'Associate Developer Intern',
        startDate: '15th of June 2026',
        endDate: '13th of July 2026',
        issueDate: '14-07-2026',
        description: syncDescription(prev.studentName, 'Associate Developer Intern', '15th of June 2026', '13th of July 2026')
      }));
    } else if (type === 'training_certificate') {
      setFormData(prev => ({
        ...prev,
        title: 'Java Full Stack Development & Microservices',
        duration: '6 Months (Jan 2026 – Jun 2026)',
        grade: 'Grade A+ (Distinction)',
        skills: 'Core Java, Spring Boot 3, React.js, Hibernate, Microservices, Docker, MySQL'
      }));
    } else if (type === 'internship_offer') {
      setFormData(prev => ({
        ...prev,
        title: 'Software Development Intern',
        duration: '3 Months (Full-Time / Hybrid)'
      }));
    } else if (type === 'mou') {
      setFormData(prev => ({
        ...prev,
        studentName: 'RKGIT / Sharda University / Galgotias',
        title: 'Academic & Industrial Training Collaboration MoU',
        duration: '3 Years (2026 – 2029)'
      }));
    } else if (type === 'workshop_certificate') {
      setFormData(prev => ({
        ...prev,
        title: 'Full Stack Web Development with React & Node.js',
        duration: 'Hands-on Technical Workshop Session',
        grade: 'Exemplary Participation (Grade A+)',
        skills: 'Modern Full Stack Web Architecture, React.js, Node.js, Industry Practices',
        description: `This is to certify that ${prev.studentName || 'Ashu Rai'} from ${prev.college || 'Galgotias University, Greater Noida'} has actively participated and successfully completed the Hands-on Industrial Workshop on "Full Stack Web Development with React & Node.js" conducted by Yukti Software. During this workshop, the participant demonstrated keen learning, analytical skills, and exemplary technical engagement.`
      }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.title.trim()) {
      alert('Please enter Candidate Name and Role/Title');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCertificateDoc({
        type: docType,
        ...formData,
        certId: formData.certId || `20260615${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        ceoSignatureUrl: ceoSignature,
        ctoSignatureUrl: ctoSignature
      });

      setPreviewDoc(result);
      setIsSuccess(true);
      await loadData();
      setActiveTab('preview');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating document:', err);
      alert('Failed to generate document: ' + err.message);
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
    const url = `https://www.yuktisoftware.com/verify/?id=${encodeURIComponent(id)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintCertificate = () => {
    const printArea = document.getElementById('official-certificate-print-area');
    if (!printArea) {
      window.print();
      return;
    }

    // Remove any stale print iframe
    const prevIframe = document.getElementById('certificate-print-frame');
    if (prevIframe) {
      prevIframe.remove();
    }

    // Grab all stylesheets and compiled styles from the current document
    const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    // Create a full-dimension invisible iframe to guarantee proper layout engine calculation
    const printIframe = document.createElement('iframe');
    printIframe.id = 'certificate-print-frame';
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
          <title>Yukti_Software_Certificate_${(previewDoc?.studentName || 'Candidate').replace(/\s+/g, '_')}_${previewDoc?.id || previewDoc?.certId || ''}</title>
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
              border: 3px solid #0c1b33 !important;
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
          console.error('Iframe print error, falling back to window.print():', err);
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

    // Ensure all images (QR code, logo, signatures) inside the iframe are fully loaded before printing
    const iframeImages = printIframe.contentDocument ? Array.from(printIframe.contentDocument.images) : [];
    if (iframeImages.length === 0) {
      doPrint();
    } else {
      let loadedCount = 0;
      let hasTriggered = false;
      const onImageLoaded = () => {
        loadedCount++;
        if (loadedCount >= iframeImages.length && !hasTriggered) {
          hasTriggered = true;
          doPrint();
        }
      };

      iframeImages.forEach((img) => {
        if (img.complete) {
          onImageLoaded();
        } else {
          img.addEventListener('load', onImageLoaded);
          img.addEventListener('error', onImageLoaded);
        }
      });

      // Fallback timeout in case of slow image response
      setTimeout(() => {
        if (!hasTriggered) {
          hasTriggered = true;
          doPrint();
        }
      }, 1500);
    }
  };

  const filteredCerts = certificates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.studentName || '').toLowerCase().includes(q) ||
      (c.id || c.certId || '').toLowerCase().includes(q) ||
      (c.college || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Print Stylesheet Overrides for Native Print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 4mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            height: auto !important;
          }
          aside, header, nav, .print\\:hidden, #certificate-print-frame {
            display: none !important;
          }
          body > #root > div {
            display: block !important;
            background: white !important;
          }
          main {
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #official-certificate-print-area {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            width: 100% !important;
            max-width: 800px !important;
            min-height: 1050px !important;
            margin: 0 auto !important;
            padding: 12mm !important;
            box-shadow: none !important;
            border: 3px solid #0c1b33 !important;
            background: white !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: block !important;
            visibility: visible !important;
          }
          #official-certificate-print-area * {
            visibility: visible !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-brand-600" />
            <span>Internship & Certification Studio</span>
          </h1>
          <p className="text-xs text-slate-500">
            Generate tamper-proof official certificates with CEO & CTO signatures, scannable QR verification & Firebase sync
          </p>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Certificate
          </button>
          <button
            onClick={() => setActiveTab('signatures')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'signatures' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Global Signatures</span>
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'registry' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registry ({certificates.length})
          </button>
          {previewDoc && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Print / Preview
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB: GLOBAL SIGNATURES UPLOADER */}
      {/* ========================================================================= */}
      {activeTab === 'signatures' && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-brand-600" />
              <span>Official Executive Signatures Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload transparent PNG signature images for the Founder & CEO and CTO. These signatures automatically attach to every generated certificate!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CEO Signature Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Founder & CEO Signature</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">MANISHA KUMARI</p>
                </div>
                {ceoSignature && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              {/* Preview Box */}
              <div className="h-28 rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center p-3 relative overflow-hidden group">
                {ceoSignature ? (
                  <img 
                    src={ceoSignature} 
                    alt="Manisha Kumari Signature" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs" 
                  />
                ) : (
                  <div className="text-center text-slate-400 space-y-1">
                    <PenTool className="w-8 h-8 mx-auto text-slate-300" />
                    <span className="text-xs font-semibold">No signature uploaded yet</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={ceoInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleSignatureUpload(e.target.files?.[0], 'ceo')}
                />
                <button
                  type="button"
                  onClick={() => ceoInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload CEO Signature (PNG)</span>
                </button>
                {ceoSignature && (
                  <button
                    type="button"
                    onClick={() => {
                      setCeoSignature('');
                      localStorage.removeItem('yukti_global_ceo_sign');
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer"
                    title="Remove Signature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* CTO Signature Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Chief Technology Officer Signature</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">MITHILESH KUMAR</p>
                </div>
                {ctoSignature && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              {/* Preview Box */}
              <div className="h-28 rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center p-3 relative overflow-hidden group">
                {ctoSignature ? (
                  <img 
                    src={ctoSignature} 
                    alt="Mithilesh Kumar Signature" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs" 
                  />
                ) : (
                  <div className="text-center text-slate-400 space-y-1">
                    <PenTool className="w-8 h-8 mx-auto text-slate-300" />
                    <span className="text-xs font-semibold">No signature uploaded yet</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={ctoInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleSignatureUpload(e.target.files?.[0], 'cto')}
                />
                <button
                  type="button"
                  onClick={() => ctoInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload CTO Signature (PNG)</span>
                </button>
                {ctoSignature && (
                  <button
                    type="button"
                    onClick={() => {
                      setCtoSignature('');
                      localStorage.removeItem('yukti_global_cto_sign');
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer"
                    title="Remove Signature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200 text-xs text-brand-800 flex items-center justify-between">
            <span>Signatures are stored in browser memory & synced with Firebase. You can proceed to generate certificates now!</span>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-1.5 rounded-lg bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 cursor-pointer"
            >
              Go to Certificate Creator →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CREATE CERTIFICATE FORM */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
          
          {/* Document Type Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Select Document Format</h3>
            
            <div className="space-y-2.5">
              {[
                {
                  id: 'internship_certificate',
                  title: 'Official Internship Certificate',
                  desc: 'Exact official template matching Yukti Software completion certificates',
                  icon: Award,
                  color: 'text-amber-600'
                },
                {
                  id: 'training_certificate',
                  title: 'Training Completion Certificate',
                  desc: 'Comprehensive training course and evaluation certificate',
                  icon: FileText,
                  color: 'text-brand-600'
                },
                {
                  id: 'internship_offer',
                  title: 'Industrial Internship Offer Letter',
                  desc: 'Official candidate onboarding document with stipend details',
                  icon: Briefcase,
                  color: 'text-indigo-600'
                },
                {
                  id: 'workshop_certificate',
                  title: 'College Workshop Certificate',
                  desc: 'Hands-on technical workshop participation & completion certificate',
                  icon: BookOpen,
                  color: 'text-emerald-600'
                },
                {
                  id: 'mou',
                  title: 'College MoU Collaboration Agreement',
                  desc: 'Institutional technical partnership and training tie-ups',
                  icon: Building2,
                  color: 'text-purple-600'
                }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-50/50 border-brand-600 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'} shrink-0`}>
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

            {/* Quick Signature Status Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Executive Signatures</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signatures')}
                  className="text-brand-600 font-bold hover:underline text-[11px]"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">CEO (Manisha Kumari):</span>
                  <span className={`font-bold ${ceoSignature ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {ceoSignature ? '✓ Uploaded' : '⚠️ Not Uploaded'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">CTO (Mithilesh Kumar):</span>
                  <span className={`font-bold ${ctoSignature ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {ctoSignature ? '✓ Uploaded' : '⚠️ Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Candidate & Certificate Parameters</span>
              <span className="text-[11px] font-mono text-slate-400">ID: {formData.certId}</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        studentName: e.target.value,
                        description: syncDescription(e.target.value, prev.title, prev.startDate, prev.endDate)
                      }));
                    }}
                    placeholder="e.g. Ashu Rai"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation / Internship Role *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        description: syncDescription(prev.studentName, e.target.value, prev.startDate, prev.endDate)
                      }));
                    }}
                    placeholder="e.g. Associate Developer Intern"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internship Start Date
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        startDate: e.target.value,
                        description: syncDescription(prev.studentName, prev.title, e.target.value, prev.endDate)
                      }));
                    }}
                    placeholder="e.g. 15th of June 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internship End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        endDate: e.target.value,
                        description: syncDescription(prev.studentName, prev.title, prev.startDate, e.target.value)
                      }));
                    }}
                    placeholder="e.g. 13th of July 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    placeholder="e.g. 14-07-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Certificate ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Certificate ID / Serial Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="certId"
                      value={formData.certId}
                      onChange={handleInputChange}
                      placeholder="e.g. 202606155364071310069"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, certId: `20260615${Math.floor(100000000000 + Math.random() * 900000000000)}` }))}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Regenerate Random ID"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Official Certificate Paragraph */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Certificate Completion Statement (Customizable)
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="This is to certify that..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none"
                />
              </div>

              {/* Signatories Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Left Signatory Name & Title</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="ceoName"
                      value={formData.ceoName}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      name="ceoTitle"
                      value={formData.ceoTitle}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Right Signatory Name & Title</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="ctoName"
                      value={formData.ctoName}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      name="ctoTitle"
                      value={formData.ctoTitle}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Official Certificate & Save</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'registry' && (
        <div className="space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate, ID or title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Certificate ID</th>
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5">Designation / Role</th>
                    <th className="p-3.5">Issue Date</th>
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
                          {cert.issueDate || '14-07-2026'}
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
                            title="View & Print Official Certificate"
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
                      <td colSpan="5" className="p-8 text-center text-slate-400 text-xs">
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
      {/* TAB 3: EXACT OFFICIAL INTERNSHIP CERTIFICATE PREVIEW & PRINT */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && previewDoc && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-900">
                Official Certificate Ready: <strong className="font-mono text-brand-600">{previewDoc.id || previewDoc.certId}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyVerifyLink(previewDoc.id || previewDoc.certId)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                {copiedId === (previewDoc.id || previewDoc.certId) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Verify Link</span>
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* EXACT AUTHENTIC TEMPLATE CONTAINER (MATCHING THE UPLOADED PDF) */}
          {/* ================================================================= */}
          <div 
            id="official-certificate-print-area"
            className="w-full max-w-[850px] mx-auto bg-white text-[#0c1b33] p-8 sm:p-14 relative overflow-hidden shadow-2xl border-[3px] border-[#0c1b33] font-serif select-none"
            style={{ minHeight: '1150px' }}
          >
            {/* Inner Thin Border */}
            <div className="absolute inset-3 border border-[#0c1b33] pointer-events-none" />

            {/* 4 Corner Geometric Greek Key Ornaments */}
            <div className="absolute top-4 left-4">
              <GreekCorner className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div className="absolute top-4 right-4 rotate-90">
              <GreekCorner className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div className="absolute bottom-4 right-4 rotate-180">
              <GreekCorner className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div className="absolute bottom-4 left-4 -rotate-90">
              <GreekCorner className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>

            {/* Subtle Repeating Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
              <div className="text-center transform -rotate-12 space-y-16">
                <p className="text-7xl font-serif font-black tracking-widest text-slate-900 uppercase">YUKTI SOFTWARE</p>
                <p className="text-7xl font-serif font-black tracking-widest text-slate-900 uppercase">YUKTI SOFTWARE</p>
                <p className="text-7xl font-serif font-black tracking-widest text-slate-900 uppercase">YUKTI SOFTWARE</p>
              </div>
            </div>

            {/* Main Certificate Content */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8 text-center pt-2 pb-2">
              
              {/* 1. Official Yukti Software Logo */}
              <div className="pt-2">
                <img 
                  src="/yukti-logo.svg" 
                  alt="Yukti Software" 
                  className="h-16 sm:h-20 w-auto mx-auto object-contain" 
                />
              </div>

              {/* 2. Certificate Header */}
              <div className="space-y-1.5 pt-4">
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-widest text-[#0c1b33] uppercase">
                  CERTIFICATE
                </h1>
                <p className="text-xs sm:text-sm font-serif font-bold tracking-[0.3em] text-[#0c1b33] uppercase">
                  OF COMPLETION
                </p>
              </div>

              {/* 3. Presentation Line */}
              <div className="pt-3">
                <p className="text-sm sm:text-base font-serif italic text-slate-800">
                  This Certificate is Awarded to
                </p>
              </div>

              {/* 4. Recipient Name */}
              <div className="py-2">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-widest text-[#0c1b33] uppercase italic">
                  {previewDoc.studentName || 'ASHU RAI'}
                </h2>
              </div>

              {/* 5. Body Text Statement */}
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <p className="text-xs sm:text-[13.5px] font-serif text-slate-800 leading-relaxed text-center sm:text-justify font-medium">
                  {previewDoc.description || (
                    `This is to certify that ${previewDoc.studentName} has successfully completed the internship program at Yukti Software as an ${previewDoc.title || 'Associate Developer Intern'} from ${previewDoc.startDate || '15th of June 2026'} to ${previewDoc.endDate || '13th of July 2026'}. During this period, she demonstrated dedication, professionalism, and a strong willingness to learn. He contributed to various projects and tasks, showing commendable growth and collaboration.`
                  )}
                </p>
              </div>

              {/* 6. Signatories & QR Code Section */}
              <div className="pt-8 sm:pt-14 grid grid-cols-3 gap-2 sm:gap-4 items-end px-2 sm:px-6">
                
                {/* Left: Founder & CEO */}
                <div className="text-center space-y-1">
                  <div className="h-14 sm:h-16 flex items-end justify-center mb-1">
                    {(previewDoc.ceoSignatureUrl || ceoSignature) ? (
                      <img 
                        src={previewDoc.ceoSignatureUrl || ceoSignature} 
                        alt="CEO Signature" 
                        className="max-h-14 sm:max-h-16 w-auto object-contain filter drop-shadow-xs" 
                      />
                    ) : (
                      <span className="font-serif italic text-sm text-slate-400">Signed</span>
                    )}
                  </div>
                  <div className="w-36 sm:w-44 border-t border-[#0c1b33] mx-auto pt-1">
                    <p className="text-[11px] sm:text-xs font-serif font-black tracking-wider text-[#0c1b33] uppercase">
                      {previewDoc.ceoName || 'MANISHA KUMARI'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-sans text-slate-600">
                      {previewDoc.ceoTitle || 'Founder & CEO'}
                    </p>
                  </div>
                </div>

                {/* Center: Real Scannable Verification QR Code */}
                <div className="text-center space-y-1">
                  <div className="inline-block p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://www.yuktisoftware.com/verify/')}`}
                      alt="Verify QR Code"
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    />
                  </div>
                  <p className="text-[8px] sm:text-[9px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                    Scan to Verify
                  </p>
                </div>

                {/* Right: CTO */}
                <div className="text-center space-y-1">
                  <div className="h-14 sm:h-16 flex items-end justify-center mb-1">
                    {(previewDoc.ctoSignatureUrl || ctoSignature) ? (
                      <img 
                        src={previewDoc.ctoSignatureUrl || ctoSignature} 
                        alt="CTO Signature" 
                        className="max-h-14 sm:max-h-16 w-auto object-contain filter drop-shadow-xs" 
                      />
                    ) : (
                      <span className="font-serif italic text-sm text-slate-400">Signed</span>
                    )}
                  </div>
                  <div className="w-36 sm:w-44 border-t border-[#0c1b33] mx-auto pt-1">
                    <p className="text-[11px] sm:text-xs font-serif font-black tracking-wider text-[#0c1b33] uppercase">
                      {previewDoc.ctoName || 'MITHILESH KUMAR'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-sans text-slate-600">
                      {previewDoc.ctoTitle || 'CTO'}
                    </p>
                  </div>
                </div>

              </div>

              {/* 7. Bottom Metadata Strip */}
              <div className="pt-8 sm:pt-10 flex items-center justify-between text-[10px] sm:text-[11px] font-sans px-4 sm:px-6 text-slate-700">
                <span className="font-medium">
                  Issued on : <strong className="text-[#0c1b33] font-bold">{previewDoc.issueDate || '14-07-2026'}</strong>
                </span>
                <span className="font-medium">
                  Certificate Id : <strong className="font-mono text-[#0c1b33] font-bold">{previewDoc.id || previewDoc.certId}</strong>
                </span>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
