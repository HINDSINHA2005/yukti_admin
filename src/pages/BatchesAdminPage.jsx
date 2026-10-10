import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles,
  AlertCircle,
  GraduationCap,
  Layers,
  Flame,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { getCollectionItems, addItem, updateItem, deleteItem } from '../services/adminService';

const AVAILABLE_COURSES = [
  "Complete Python Training Course",
  "Python Full Stack Development",
  "Java Full Stack Development Course",
  "Core & Advanced Java Training",
  "Spring Boot & Microservices",
  "Data Structures & Algorithms (DSA)",
  "AI Full Stack Web Development",
  "AI & Machine Learning Specialist",
  "MERN Stack Web Development",
  "React JS Frontend Engineering",
  "Full Stack Software Engineering",
  "Software Development & Testing Course",
  "Data Analytics & Python",
  "Database Management System (DBMS)",
  "SQL Training & Advanced Labs",
  "NoSQL Database & MongoDB",
  "HTML5, CSS3 & Responsive Web"
];

export default function BatchesAdminPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [formData, setFormData] = useState({
    courseName: AVAILABLE_COURSES[0],
    batchCode: '',
    mode: 'Classroom (Greater Noida Center)',
    timing: '10:00 AM - 12:30 PM (Mon to Fri)',
    startDate: 'Starts Next Monday',
    duration: '4 Months',
    status: 'Upcoming - Open',
    seatsTotal: 20,
    seatsLeft: 6,
    trainer: 'Senior Industry Mentor',
    highlights: 'Live Capstone Project, 100% Placement Support, ISO Certificate',
    location: '503, MSX Tower 1, Alpha-1, Greater Noida',
    isActive: true
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await getCollectionItems('batches', 'createdAt', 'desc');
      setBatches(data || []);
    } catch (err) {
      console.warn('Could not load Firestore batches:', err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    const randomCode = 'BATCH-' + Math.floor(100 + Math.random() * 900);
    setFormData({
      courseName: AVAILABLE_COURSES[0],
      batchCode: randomCode,
      mode: 'Classroom (Greater Noida Center)',
      timing: '10:00 AM - 12:30 PM (Mon to Fri)',
      startDate: 'Starts Upcoming Monday',
      duration: '4 Months',
      status: 'Upcoming - Open',
      seatsTotal: 20,
      seatsLeft: 7,
      trainer: 'Senior Industry Mentor',
      highlights: 'Live Capstone Project, 100% Placement Support, ISO Certificate',
      location: '503, MSX Tower 1, Alpha-1, Greater Noida',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b.id);
    setFormData({
      courseName: b.courseName || AVAILABLE_COURSES[0],
      batchCode: b.batchCode || '',
      mode: b.mode || 'Classroom (Greater Noida Center)',
      timing: b.timing || '',
      startDate: b.startDate || '',
      duration: b.duration || '4 Months',
      status: b.status || 'Upcoming - Open',
      seatsTotal: b.seatsTotal || 20,
      seatsLeft: b.seatsLeft || 5,
      trainer: b.trainer || 'Industry Mentor',
      highlights: b.highlights || '',
      location: b.location || '503, MSX Tower 1, Alpha-1, Greater Noida',
      isActive: b.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedbackMsg('');

    try {
      if (editingId && !editingId.startsWith('sample-')) {
        await updateItem('batches', editingId, formData);
        setFeedbackMsg('Batch updated successfully in Firestore!');
      } else {
        await addItem('batches', formData);
        setFeedbackMsg('New batch schedule published to website live!');
      }
      setIsModalOpen(false);
      loadBatches();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert('Error saving batch: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch schedule?')) return;
    try {
      if (!id.startsWith('sample-')) {
        await deleteItem('batches', id);
      }
      setBatches(prev => prev.filter(b => b.id !== id));
      setFeedbackMsg('Batch deleted.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      alert('Error deleting batch: ' + err.message);
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesMode = filterMode === 'all' || (b.mode && b.mode.toLowerCase().includes(filterMode.toLowerCase()));
    if (!matchesMode) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (b.courseName || '').toLowerCase().includes(term) ||
      (b.batchCode || '').toLowerCase().includes(term) ||
      (b.trainer || '').toLowerCase().includes(term) ||
      (b.timing || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Upcoming & Ongoing Batches Manager
            </h2>
            <p className="text-xs text-slate-500">
              Publish new course batches, class schedules, timings, seat availability & classroom modes to the live website.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Batch Schedule</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course, batch code, timing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
          >
            <option value="all">All Delivery Modes</option>
            <option value="classroom">Classroom Only</option>
            <option value="online">Live Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Batches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBatches.map((batch) => (
          <div 
            key={batch.id} 
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
          >
            <div className="space-y-3">
              {/* Header: Course & Status Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 font-black text-[10px] uppercase tracking-wider border border-brand-200">
                      {batch.batchCode || 'BATCH'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center space-x-1 ${
                      batch.status === 'Filling Fast'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      <Flame className="w-3 h-3 text-amber-600" />
                      <span>{batch.status || 'Upcoming'}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {batch.courseName}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 font-extrabold text-[10px] shadow-xs">
                    {batch.seatsLeft || 5} Seats Left
                  </span>
                </div>
              </div>

              {/* Schedule Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="font-bold text-slate-800 truncate">{batch.startDate}</span>
                </div>

                <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{batch.timing}</span>
                </div>

                <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{batch.mode}</span>
                </div>

                <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Mentor: {batch.trainer}</span>
                </div>
              </div>

              {/* Highlights */}
              {batch.highlights && (
                <div className="text-[11px] text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-200">
                  <strong className="text-slate-700">Batch Highlights:</strong> {batch.highlights}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-400">
                Location: {batch.location}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(batch)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Edit Batch"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(batch.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  title="Delete Batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Batch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? 'Edit Batch Schedule' : 'Create New Course Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Course *</label>
                <select
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {AVAILABLE_COURSES.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Batch Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Code / Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="e.g. PY-FS-NOV26"
                  />
                </div>

                {/* Delivery Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Mode *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                  >
                    <option value="Classroom (Greater Noida Center)">Classroom (Greater Noida Center)</option>
                    <option value="Live Interactive Online">Live Interactive Online</option>
                    <option value="Hybrid (Classroom + Online)">Hybrid (Classroom + Online)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="e.g. Starts 15th Oct 2026 / Upcoming Monday"
                  />
                </div>

                {/* Timings */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Timings & Days *</label>
                  <input
                    type="text"
                    required
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="e.g. 10:00 AM - 12:30 PM (Mon-Fri)"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="e.g. 4 Months"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                  >
                    <option value="Upcoming - Open">Upcoming - Open</option>
                    <option value="Filling Fast">Filling Fast (Few Seats)</option>
                    <option value="Weekend Special">Weekend Special</option>
                    <option value="Ongoing (Enrolling Next Cohort)">Ongoing (Enrolling Next Cohort)</option>
                  </select>
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Batch Seats</label>
                  <input
                    type="number"
                    value={formData.seatsTotal}
                    onChange={(e) => setFormData({ ...formData, seatsTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="20"
                  />
                </div>

                {/* Seats Left */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seats Available Left</label>
                  <input
                    type="number"
                    value={formData.seatsLeft}
                    onChange={(e) => setFormData({ ...formData, seatsLeft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Trainer / Mentor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Trainer / Mentor</label>
                <input
                  type="text"
                  value={formData.trainer}
                  onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                  placeholder="e.g. Sanjay Sir (Senior Enterprise Architect)"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Key Highlights</label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                  placeholder="e.g. Live Capstone Project, 100% Placement Support, ISO Certificate"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Center Location / Venue</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                  placeholder="503, MSX Tower 1, Alpha-1, Greater Noida"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Publishing...' : 'Save & Publish Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
