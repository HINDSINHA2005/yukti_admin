import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, GraduationCap, X, Check, BookOpen } from 'lucide-react';
import { 
  getCollectionItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../services/adminService';

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    category: 'programming',
    badge: 'Accredited Certification',
    duration: '4 - 6 Months',
    description: '',
    highlightsText: '100% Practical Labs\nLive Industry Capstone\n1-on-1 Mentor Guidance\nPlacement & Mock Interviews'
  });
  const [submitting, setSubmitting] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const items = await getCollectionItems('courses', 'createdAt', 'desc');
      setCourses(items);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      key: '',
      title: '',
      category: 'programming',
      badge: 'Accredited Certification',
      duration: '4 - 6 Months',
      description: 'Master industry concepts with hands-on labs and 1-on-1 mentorship.',
      highlightsText: '100% Practical Labs\nLive Industry Capstone\n1-on-1 Mentor Guidance\nPlacement & Mock Interviews'
    });
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      highlightsText: Array.isArray(course.highlights) ? course.highlights.join('\n') : (course.highlights || '')
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slug = (formData.key || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
      const highlightsArray = formData.highlightsText.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        ...formData,
        key: slug,
        slug: slug,
        highlights: highlightsArray,
        topics: highlightsArray
      };

      if (editingCourse) {
        await updateItem('courses', editingCourse.id, payload);
      } else {
        await addItem('courses', payload);
      }

      setModalOpen(false);
      loadCourses();
    } catch (err) {
      alert('Error saving course: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course from Firestore?')) return;
    try {
      await deleteItem('courses', id);
      loadCourses();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Course Additions & Management</h1>
          <p className="text-xs text-slate-400">Add dynamic IT courses to merge with the 16 core master tracks on the website</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course Track</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading courses from Firestore...</div>
      ) : courses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Extra Dynamic Courses in Firestore</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The website is displaying all 16 built-in master syllabus tracks. Any courses you add here will appear dynamically on top!
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500"
          >
            Add First Dynamic Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 flex flex-col justify-between shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {c.badge || c.tag || 'Certified'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{c.duration}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{c.description}</p>

                {/* Highlights */}
                {c.highlights && (
                  <ul className="space-y-1 pt-1 text-xs text-slate-300">
                    {(Array.isArray(c.highlights) ? c.highlights : c.highlights.split(',')).slice(0, 3).map((h, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(c)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Course</span>
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">
                {editingCourse ? 'Edit' : 'Add New'} Course
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cyber Security & Ethical Hacking"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="programming">Programming & Dev</option>
                    <option value="fullstack">Full Stack & MERN</option>
                    <option value="ai">AI & Data Science</option>
                    <option value="databases">Database Systems</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 4 - 6 Months"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Badge / Tag</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Certified SOC Analyst"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Overview / Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive curriculum details and learning outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Curriculum Highlights (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.highlightsText}
                  onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                  placeholder="Highlight 1&#10;Highlight 2&#10;Highlight 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50">
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
