import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Users, X, Award, ShieldCheck, Mail } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { 
  getCollectionItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../services/adminService';

export default function TeamAdminPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    education: '',
    experience: '',
    image: '',
    bio: '',
    quote: '',
    skills: 'React.js, Java, Spring Boot, System Design',
    order: 1
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const items = await getCollectionItems('team_members', 'order', 'asc');
      setTeam(items);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: 'Senior Technical Lead & Mentor',
      education: 'B.Tech / M.Tech',
      experience: '6+ Years IT Industry',
      image: '',
      bio: '',
      quote: '',
      skills: 'Full Stack, React.js, Python, Mentorship',
      order: team.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      ...member,
      skills: Array.isArray(member.skills || member.specialties) 
        ? (member.skills || member.specialties).join(', ') 
        : (member.skills || member.specialties || '')
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.skills;

      const payload = {
        ...formData,
        specialties: skillsArray,
        skills: skillsArray,
        order: Number(formData.order) || 1
      };

      if (editingMember) {
        await updateItem('team_members', editingMember.id, payload);
      } else {
        await addItem('team_members', payload);
      }

      setModalOpen(false);
      loadTeam();
    } catch (err) {
      alert('Error saving team member: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member from Firestore?')) return;
    try {
      await deleteItem('team_members', id);
      loadTeam();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Meet the Team Management</h1>
          <p className="text-xs text-slate-400">Add and manage executive leadership, architects & mentors on the website</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Faculty / Member</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading team members...</div>
      ) : team.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Firestore Team Members Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Default founder and CTO are active from local configuration. Click below to add dynamic team members!
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500"
          >
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-brand-500/40 shrink-0">
                    <img src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{member.name}</h4>
                    <p className="text-xs font-bold text-brand-400">{member.role}</p>
                    <p className="text-[11px] text-slate-400">{member.experience}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{member.bio}</p>

                {/* Specialties */}
                {(member.specialties || member.skills) && (
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(member.specialties || member.skills) 
                      ? (member.specialties || member.skills) 
                      : (member.specialties || member.skills || '').split(',')
                    ).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(member)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                  title="Delete Member"
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
                {editingMember ? 'Edit' : 'Add'} Team Member
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Priya Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Role / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead AI & Cloud Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Education / Degree</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g. M.Tech (AI), IIT Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 8+ Years Enterprise Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Profile Photo (Cloudinary / URL)"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Skills / Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Java, Spring Boot, React.js, Docker, AWS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Executive Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of experience and student mentoring accomplishments..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingMember ? 'Update Profile' : 'Add to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
