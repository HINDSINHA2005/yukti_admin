import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  MessageSquareQuote,
  Building2, 
  Award, 
  User,
  Sparkles
} from 'lucide-react';
import { getCollectionItems, addItem, updateItem, deleteItem } from '../services/adminService';

const SAMPLE_REVIEWS = [
  {
    id: 'sample-1',
    name: 'Rohan Sharma',
    role: 'Java Full Stack Developer',
    company: 'TCS Digital',
    packageLPA: '7.5 LPA',
    rating: 5,
    batchYear: '2024',
    courseName: 'Java Full Stack & Microservices',
    reviewText: 'Yukti Software provided hands-on microservices development training that directly helped me clear my Tier-1 technical interviews with confidence.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isFeatured: true
  },
  {
    id: 'sample-2',
    name: 'Pooja Verma',
    role: 'AI / Python Engineer',
    company: 'Innovatech Labs',
    packageLPA: '8.2 LPA',
    rating: 5,
    batchYear: '2024',
    courseName: 'AI Full Stack Web Development',
    reviewText: 'The project-based curriculum on LLM agents and FastAPI was unmatched. Sanjay Sir and mentors cleared every doubt patiently.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    isFeatured: true
  }
];

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    packageLPA: '',
    rating: 5,
    batchYear: '2024',
    courseName: 'Python Full Stack',
    reviewText: '',
    avatarUrl: '',
    isFeatured: true
  });
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getCollectionItems('reviews', 'createdAt', 'desc');
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        setReviews(SAMPLE_REVIEWS);
      }
    } catch (err) {
      console.warn('Could not load Firestore reviews, using sample defaults:', err);
      setReviews(SAMPLE_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Full Stack Developer',
      company: '',
      packageLPA: '',
      rating: 5,
      batchYear: '2024',
      courseName: 'Python Full Stack',
      reviewText: '',
      avatarUrl: '',
      isFeatured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      packageLPA: item.packageLPA || '',
      rating: item.rating || 5,
      batchYear: item.batchYear || '2024',
      courseName: item.courseName || '',
      reviewText: item.reviewText || '',
      avatarUrl: item.avatarUrl || '',
      isFeatured: item.isFeatured !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedbackMsg('');

    try {
      if (editingId && !editingId.startsWith('sample-')) {
        await updateItem('reviews', editingId, formData);
        setFeedbackMsg('Review updated successfully!');
      } else {
        await addItem('reviews', formData);
        setFeedbackMsg('Review added successfully to Firestore!');
      }
      setIsModalOpen(false);
      loadReviews();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert('Error saving review: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student review?')) return;
    try {
      if (!id.startsWith('sample-')) {
        await deleteItem('reviews', id);
      }
      setReviews(prev => prev.filter(r => r.id !== id));
      setFeedbackMsg('Review deleted.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-xs">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Student Reviews & Placement Success Stories
            </h2>
            <p className="text-xs text-slate-500">
              Manage student feedback, placed candidate packages, and verified 5-star testimonials.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student Review</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
          >
            <div className="space-y-3">
              {/* Top Row: User Avatar & Stars */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {rev.avatarUrl ? (
                      <img src={rev.avatarUrl} alt={rev.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{rev.name}</h3>
                    <p className="text-[11px] text-slate-500">{rev.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-0.5 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Company & CTC Badge */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-bold">
                {rev.company && (
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200 flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span>{rev.company}</span>
                  </span>
                )}
                {rev.packageLPA && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>{rev.packageLPA}</span>
                  </span>
                )}
                {rev.courseName && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {rev.courseName}
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                "{rev.reviewText}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-400">
                Batch: {rev.batchYear || '2024'}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(rev)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Edit Review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? 'Edit Student Review' : 'Add New Placement Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g. Aman Gupta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Placed</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g. TCS / Infosys / Startup"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Package (CTC / LPA)</label>
                  <input
                    type="text"
                    value={formData.packageLPA}
                    onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g. 6.5 LPA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Completed</label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g. Python Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Photo URL (Optional)</label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Quote / Testimonial *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Share the student's training experience and career outcome..."
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
                  <span>{saving ? 'Saving...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
