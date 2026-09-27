import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Briefcase, Layers, X, Check, Globe } from 'lucide-react';
import { 
  getCollectionItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../services/adminService';

export default function InternshipsAdminPage() {
  const [activeSubTab, setActiveSubTab] = useState('roles'); // 'roles' | 'domains'
  const [roles, setRoles] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    department: 'Software Engineering',
    badge: 'Live Opening',
    keyFocusText: 'Bring UI/UX design to life with responsive components\nBuild scalable backend APIs with database integration\nDeploy containerized microservices on AWS cloud',
    technologiesText: 'React.js, Node.js, Express, MongoDB, Tailwind CSS',
    description: '',
    name: '',
    openings: '10 Seats'
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedRoles, fetchedDomains] = await Promise.all([
        getCollectionItems('internship_roles', 'createdAt', 'desc'),
        getCollectionItems('internship_domains', 'order', 'asc')
      ]);
      setRoles(fetchedRoles);
      setDomains(fetchedDomains);
    } catch (err) {
      console.error('Failed to load internship data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      tagline: 'Work on live production microservices with senior mentor guidance.',
      department: 'Software Engineering',
      badge: 'Live Opening',
      keyFocusText: 'Hands-on production feature development under senior mentors.\nCode reviews, bug troubleshooting, and CI/CD deployment drills.\nReal-world enterprise system design and API integrations.',
      technologiesText: 'React.js, Node.js, Express, MongoDB, PostgreSQL, Git',
      description: 'As an intern, you will build live customer-facing modules and full-stack APIs.',
      name: '',
      openings: '10 Seats'
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      keyFocusText: Array.isArray(item.keyFocus) ? item.keyFocus.join('\n') : (item.keyFocus || ''),
      technologiesText: Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || '')
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (activeSubTab === 'roles') {
        const payload = {
          title: formData.title,
          tagline: formData.tagline,
          department: formData.department,
          badge: formData.badge,
          keyFocus: formData.keyFocusText.split('\n').map(s => s.trim()).filter(Boolean),
          technologies: formData.technologiesText.split(',').map(s => s.trim()).filter(Boolean),
          description: formData.description
        };

        if (editingItem) {
          await updateItem('internship_roles', editingItem.id, payload);
        } else {
          await addItem('internship_roles', payload);
        }
      } else {
        const payload = {
          name: formData.name,
          openings: formData.openings
        };

        if (editingItem) {
          await updateItem('internship_domains', editingItem.id, payload);
        } else {
          await addItem('internship_domains', payload);
        }
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Error saving internship record: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship posting?')) return;
    try {
      const collectionName = activeSubTab === 'roles' ? 'internship_roles' : 'internship_domains';
      await deleteItem(collectionName, id);
      loadData();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Internships & Careers Management</h1>
          <p className="text-xs text-slate-400">Post new job openings and technology internship tracks on the website</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeSubTab === 'roles' ? 'Internship Role' : 'Technology Track'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'roles' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Internship Roles ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('domains')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'domains' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Technology Tracks ({domains.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading internship postings...</div>
      ) : activeSubTab === 'roles' ? (
        roles.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Briefcase className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Firestore Internship Roles Added Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Default roles (Frontend, Backend, Full Stack) are live. Click below to add new dynamic openings!
            </p>
            <button onClick={openAddModal} className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500">
              Post New Role
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 flex flex-col justify-between shadow-lg group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {role.badge || 'Opening'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{role.department}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{role.title}</h3>
                  <p className="text-xs text-brand-400 font-medium">{role.tagline}</p>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{role.description}</p>

                  {/* Tech stack */}
                  {role.technologies && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(Array.isArray(role.technologies) ? role.technologies : role.technologies.split(',')).map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button onClick={() => openEditModal(role)} className="flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Role</span>
                  </button>
                  <button onClick={() => handleDelete(role.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        domains.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Layers className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Firestore Technology Tracks Added Yet</h3>
            <button onClick={openAddModal} className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500">
              Add Technology Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {domains.map((dom) => (
              <div key={dom.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
                <div>
                  <h4 className="text-sm font-bold text-white">{dom.name}</h4>
                  <span className="text-xs font-mono text-emerald-400">{dom.openings || 'Live Seats'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => openEditModal(dom)} className="p-1.5 text-slate-400 hover:text-white">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(dom.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">
                {editingItem ? 'Edit' : 'Add'} {activeSubTab === 'roles' ? 'Internship Role' : 'Technology Track'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeSubTab === 'roles' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Role Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 4. AI & Cloud DevOps Intern"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Department / Domain</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Cloud & AI DevOps"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Badge</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. DevOps Track"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Tagline / Summary</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. Build CI/CD pipelines and microservices in production."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Technologies / Stack (comma separated)</label>
                    <input
                      type="text"
                      value={formData.technologiesText}
                      onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
                      placeholder="Docker, Kubernetes, AWS, FastAPI, Python"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Key Focus Points (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.keyFocusText}
                      onChange={(e) => setFormData({ ...formData, keyFocusText: e.target.value })}
                      placeholder="Point 1&#10;Point 2&#10;Point 3"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Job Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed overview of tasks, deliverables and mentorship..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Track Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. AI, Deep Learning & LLM Ops"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Available Seats / Openings</label>
                    <input
                      type="text"
                      value={formData.openings}
                      onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                      placeholder="e.g. 10 Seats"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50">
                  {submitting ? 'Saving...' : editingItem ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
