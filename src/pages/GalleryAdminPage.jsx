import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Video, 
  Play, 
  X, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { 
  getCollectionItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../services/adminService';

export default function GalleryAdminPage() {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'classroom',
    categoryLabel: 'Classroom & Labs',
    caption: '',
    image: '',
    badge: 'Greater Noida Center',
    student: '',
    role: '',
    duration: '5:00 min',
    thumbnail: '',
    videoUrl: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const [fetchedPhotos, fetchedVideos] = await Promise.all([
        getCollectionItems('gallery_photos', 'createdAt', 'desc'),
        getCollectionItems('gallery_videos', 'createdAt', 'desc')
      ]);
      setPhotos(fetchedPhotos);
      setVideos(fetchedVideos);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'classroom',
      categoryLabel: 'Classroom & Labs',
      caption: '',
      image: '',
      badge: 'Greater Noida Center',
      student: '',
      role: '',
      duration: '5:00 min',
      thumbnail: '',
      videoUrl: '',
      description: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'classroom',
      categoryLabel: item.categoryLabel || 'Classroom & Labs',
      caption: item.caption || '',
      image: item.image || '',
      badge: item.badge || 'Greater Noida Center',
      student: item.student || '',
      role: item.role || '',
      duration: item.duration || '5:00 min',
      thumbnail: item.thumbnail || '',
      videoUrl: item.videoUrl || '',
      description: item.description || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const collectionName = activeTab === 'photos' ? 'gallery_photos' : 'gallery_videos';
      
      if (editingItem) {
        await updateItem(collectionName, editingItem.id, formData);
      } else {
        await addItem(collectionName, formData);
      }

      setModalOpen(false);
      loadMedia();
    } catch (err) {
      alert('Error saving gallery item: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item? It will be removed from the live website.')) return;
    try {
      const collectionName = activeTab === 'photos' ? 'gallery_photos' : 'gallery_videos';
      await deleteItem(collectionName, id);
      loadMedia();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gallery Management</h1>
          <p className="text-xs text-slate-500">Upload and manage live Photos & Video Testimonials for the website</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === 'photos' ? 'Photo' : 'Video Story'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-brand-600 to-accent-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos Collection ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-brand-600 to-accent-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Stories ({videos.length})</span>
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading gallery data from Firestore...</div>
      ) : activeTab === 'photos' ? (
        photos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">No Dynamic Photos in Firestore Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The website is currently rendering default local photos. Click below to add your first dynamic photo!
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500 cursor-pointer"
            >
              Add Photo to Firestore
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group">
                <div className="relative h-48 bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-900/80 backdrop-blur-md text-white">
                    {item.badge}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-brand-700 uppercase">{item.categoryLabel || item.category}</span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.caption || item.description}</p>
                </div>
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        videos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
            <Video className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">No Dynamic Videos in Firestore Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add student testimonials, success stories, and masterclass recordings to show dynamically on the website.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500 cursor-pointer"
            >
              Add Video Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <div key={vid.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4 flex flex-col justify-between">
                <div className="relative h-44 rounded-2xl bg-slate-100 overflow-hidden">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/80 text-white">
                    ⏱ {vid.duration}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-brand-700">{vid.student} • {vid.role}</p>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{vid.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{vid.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(vid)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'photos' ? 'Photo' : 'Video Story'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={activeTab === 'photos' ? "e.g. AI & GenAI Hackathon 2026" : "e.g. Placed at Amazon: My 6-Month Journey"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>

              {activeTab === 'photos' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          category: e.target.value,
                          categoryLabel: e.target.value === 'placements' ? 'Placement Drives' : e.target.value === 'workshops' ? 'Hackathons & Events' : 'Classroom & Labs'
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-500"
                      >
                        <option value="classroom">Classroom & Labs</option>
                        <option value="placements">Placement Drives</option>
                        <option value="workshops">Hackathons & Events</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Badge / Tag</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Greater Noida Center"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <ImageUploader
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="Photo Image (Cloudinary / URL)"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Caption / Description</label>
                    <textarea
                      rows={3}
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="Brief description of the event or lab session..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Student / Speaker Name</label>
                      <input
                        type="text"
                        required
                        value={formData.student}
                        onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Role / Company</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. SDE-1 at Infosys"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 5:20 min"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Badge</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Student Success"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Video Thumbnail */}
                  <ImageUploader
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    label="Video Thumbnail Image"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Video Link (YouTube / Cloudinary / MP4)</label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Summary of student career transformation..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving to Firestore...' : editingItem ? 'Update Item' : 'Publish to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
