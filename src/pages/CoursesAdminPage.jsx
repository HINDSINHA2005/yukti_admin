import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  X, 
  Check, 
  BookOpen, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  Briefcase, 
  Users, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  CheckCircle2, 
  Target, 
  ShieldCheck, 
  FileText,
  Search,
  ArrowRight
} from 'lucide-react';
import { 
  getCollectionItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../services/adminService';

// Initial / Blank Course State with ALL Main Website Sections
const getEmptyCourseForm = () => ({
  // 1. Basic Info & Meta
  key: '',
  title: '',
  headline: '',
  category: 'programming',
  badge: 'Accredited Certification',
  duration: '4 - 6 Months',
  description: '',
  fullDescriptionText: '',
  highlightsText: '100% Practical Labs\nLive Industry Capstone\n1-on-1 Mentor Guidance\nPlacement & Mock Interviews',

  // 2. Syllabus & Modules
  syllabusHeading: 'Course Curriculum & Practical Modules',
  curriculum: [
    {
      moduleTitle: 'Module 1: Fundamentals & Environment Setup',
      topicsText: 'Introduction to Architecture\nDevelopment Environment Setup\nCore Syntax & Foundational Concepts\nFirst Practical Project Build'
    },
    {
      moduleTitle: 'Module 2: Core Implementation & Operations',
      topicsText: 'Working with Data & Logic\nCRUD Operations & Data Manipulation\nBest Practices & Industrial Standards\nHands-on Practice Exercises'
    },
    {
      moduleTitle: 'Module 3: Capstone Projects & Production Deployment',
      topicsText: 'Live Enterprise Project Development\nDebugging, Testing & Optimization\nDeployment & Cloud Hosting\nInterview & Portfolio Preparation'
    }
  ],

  // 3. Different Approach & Benefits
  differentApproach: {
    heading: 'How This Course Takes a Different Approach',
    intro: 'At Yukti Software, we believe in hands-on practical learning rather than mere textbook theory. Our industry curriculum and professional mentorship prepare you for real-world software engineering.',
    points: [
      {
        title: 'Relevant Industry Curriculum',
        desc: 'Learn tools, libraries, and frameworks currently in demand by top IT enterprises.'
      },
      {
        title: 'Expert Mentors',
        desc: 'Direct 1-on-1 guidance from software engineers with real production experience.'
      },
      {
        title: 'Real-Time Practical Projects',
        desc: 'Build functional portfolio applications that impress recruiters in technical rounds.'
      },
      {
        title: 'Interview & Placement Prep',
        desc: 'Rigorous mock technical interviews, algorithmic challenges, and resume tailoring.'
      }
    ]
  },
  careerBenefitsHeading: 'Benefits of Enrolling in Our Complete Course',
  careerBenefits: [
    {
      title: '1. Develop Practical Industry Skills',
      desc: 'Gain practical confidence by building real applications from scratch with industrial standards.'
    },
    {
      title: '2. Mentorship from Senior Leads',
      desc: 'Get prompt doubt clarification and code reviews from senior developers.'
    },
    {
      title: '3. Job-Oriented Placement Support',
      desc: 'Prepare for top IT opportunities with dedicated mock interviews and portfolio guidance.'
    }
  ],

  // 4. Eligibility & Prerequisites
  whoCanEnroll: {
    heading: 'Who Can Consider Enrolling in Our Certified Course?',
    intro: 'This program is tailored for aspiring engineers, graduates, and professionals wanting to fast-track their tech careers.',
    pointsText: 'College students (B.Tech, BCA, MCA, B.Sc. IT)\nFresh graduates seeking high-paying developer roles\nWorking professionals switching to modern software stacks\nFreelancers aiming to handle complex client projects\nEntrepreneurs wanting to manage and scale their own software'
  },
  thingsToKnow: {
    heading: 'Things You Need to Know Before Enrolling',
    intro: 'Here are key aspects you should know about this course to make the most of your learning journey:',
    pointsText: 'No advanced prerequisites needed - starts from fundamentals\nLive coding sessions with dedicated lab mentors\nRegular assignments and milestone code reviews\nDedicated placement cell assistance for interviews\nFlexible morning, evening, and weekend batches'
  },

  // 5. Careers & Target Roles
  showCareerOpportunitiesSection: true,
  careerOpportunitiesHeading: 'Career Opportunities After Completing This Course',
  careerOpportunitiesText: 'Full Stack Developer\nBackend Engineer\nFrontend Developer\nSoftware Development Engineer\nTechnical Consultant',
  careerRolesHeading: 'High-Paying Roles & Industry Scope [Jobs]',
  careerRolesTable: [
    {
      role: 'Junior Software Engineer',
      responsibilities: 'Assist in developing core application modules, bug fixing, and unit testing.',
      skillsOrPackage: '₹4–8 LPA (Global: $50,000–$85,000/yr)'
    },
    {
      role: 'Full Stack Developer',
      responsibilities: 'Design and support end-to-end user interfaces, APIs, and database models.',
      skillsOrPackage: '₹5–12 LPA (Global: $65,000–$110,000/yr)'
    },
    {
      role: 'Senior Technical Lead',
      responsibilities: 'Architect scalable solutions, lead sprint reviews, and oversee code quality.',
      skillsOrPackage: '₹10–22 LPA (Global: $90,000–$150,000/yr)'
    }
  ],

  // 6. Why Choose Us & FAQs
  whyChooseYukti: {
    heading: 'Why Choose Yukti Software?',
    intro: 'Yukti Software provides an ecosystem designed for career growth, hands-on development, and direct placement opportunities.',
    pointsText: 'Learn directly from senior industry software engineers\n100% practical lab practice on modern developer workstations\nPortfolio-ready capstone projects reviewed by tech leads\nMock technical interviews and resume optimization\nLifetime access to course revisions and alumni network'
  },
  faqs: [
    {
      question: 'Is this course suitable for complete beginners?',
      answer: 'Yes! We start from programming fundamentals and gradually guide you through advanced concepts with hands-on practice.'
    },
    {
      question: 'Are live projects included in the curriculum?',
      answer: 'Absolutely. You will build and deploy real-world production projects to showcase in your portfolio.'
    },
    {
      question: 'Does Yukti Software offer placement assistance?',
      answer: 'Yes, we provide comprehensive placement preparation including technical mock interviews, resume reviews, and interview scheduling.'
    }
  ]
});

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal & Tabs
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(getEmptyCourseForm());
  const [submitting, setSubmitting] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const items = await getCollectionItems('courses', 'createdAt', 'desc');
      setCourses(items || []);
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
    setFormData(getEmptyCourseForm());
    setActiveTab('basic');
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);

    // Map existing course data to the rich form fields
    const fullDescText = Array.isArray(course.fullDescription) 
      ? course.fullDescription.join('\n\n') 
      : (course.fullDescription || course.description || '');

    const highText = Array.isArray(course.highlights) 
      ? course.highlights.join('\n') 
      : (course.highlights || '');

    // Map curriculum modules
    const rawCurriculum = course.curriculum || course.modules || [];
    const formattedCurriculum = rawCurriculum.map(m => ({
      moduleTitle: m.moduleTitle || m.title || 'Module',
      topicsText: Array.isArray(m.topics) ? m.topics.join('\n') : (m.topics || '')
    }));

    // Map different approach
    const diff = course.differentApproach || {};
    const formattedDiff = {
      heading: diff.heading || 'How This Course Takes a Different Approach',
      intro: diff.intro || '',
      points: Array.isArray(diff.points) ? diff.points : []
    };

    // Map career benefits
    const benefits = Array.isArray(course.careerBenefits) ? course.careerBenefits : [];

    // Map who can enroll
    const who = course.whoCanEnroll || {};
    const whoText = Array.isArray(who.points) ? who.points.join('\n') : (who.points || '');

    // Map things to know
    const things = course.thingsToKnow || {};
    const thingsText = Array.isArray(things.points) ? things.points.join('\n') : (things.points || '');

    // Map career opportunities
    const oppsText = Array.isArray(course.careerOpportunities) 
      ? course.careerOpportunities.join('\n') 
      : (course.careerOpportunities || '');

    // Map career roles table
    const roles = Array.isArray(course.careerRolesTable) 
      ? course.careerRolesTable 
      : (Array.isArray(course.careerTable) ? course.careerTable : []);

    // Map why choose us
    const why = course.whyChooseYukti || course.whyChooseUs || {};
    const whyPointsText = Array.isArray(why.points) ? why.points.join('\n') : (Array.isArray(why) ? why.join('\n') : '');

    // Map FAQs
    const faqs = Array.isArray(course.faqs) ? course.faqs : [];

    setFormData({
      key: course.key || course.slug || '',
      title: course.title || '',
      headline: course.headline || '',
      category: course.category || 'programming',
      badge: course.badge || course.tag || 'Accredited Certification',
      duration: course.duration || '4 - 6 Months',
      description: course.description || '',
      fullDescriptionText: fullDescText,
      highlightsText: highText,

      syllabusHeading: course.syllabusHeading || 'Course Curriculum & Practical Modules',
      curriculum: formattedCurriculum.length > 0 ? formattedCurriculum : getEmptyCourseForm().curriculum,

      differentApproach: formattedDiff.points.length > 0 ? formattedDiff : getEmptyCourseForm().differentApproach,
      careerBenefitsHeading: course.careerBenefitsHeading || 'Benefits of Enrolling in Our Complete Course',
      careerBenefits: benefits.length > 0 ? benefits : getEmptyCourseForm().careerBenefits,

      whoCanEnroll: {
        heading: who.heading || 'Who Can Consider Enrolling in Our Certified Course?',
        intro: who.intro || '',
        pointsText: whoText || getEmptyCourseForm().whoCanEnroll.pointsText
      },
      thingsToKnow: {
        heading: things.heading || 'Things You Need to Know Before Enrolling',
        intro: things.intro || '',
        pointsText: thingsText || getEmptyCourseForm().thingsToKnow.pointsText
      },

      showCareerOpportunitiesSection: course.showCareerOpportunitiesSection !== false,
      careerOpportunitiesHeading: course.careerOpportunitiesHeading || 'Career Opportunities After Completing This Course',
      careerOpportunitiesText: oppsText || getEmptyCourseForm().careerOpportunitiesText,
      careerRolesHeading: course.careerRolesHeading || 'High-Paying Roles & Industry Scope [Jobs]',
      careerRolesTable: roles.length > 0 ? roles : getEmptyCourseForm().careerRolesTable,

      whyChooseYukti: {
        heading: why.heading || 'Why Choose Yukti Software?',
        intro: why.intro || '',
        pointsText: whyPointsText || getEmptyCourseForm().whyChooseYukti.pointsText
      },
      faqs: faqs.length > 0 ? faqs : getEmptyCourseForm().faqs
    });

    setActiveTab('basic');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slug = (formData.key || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
      const highlightsArray = formData.highlightsText.split('\n').map(s => s.trim()).filter(Boolean);
      const fullDescArray = formData.fullDescriptionText ? formData.fullDescriptionText.split('\n\n').map(s => s.trim()).filter(Boolean) : [formData.description];

      // Parse Curriculum
      const parsedCurriculum = formData.curriculum.map(m => ({
        moduleTitle: m.moduleTitle.trim(),
        topics: m.topicsText.split('\n').map(s => s.trim()).filter(Boolean)
      }));

      // Parse Who Can Enroll
      const whoPoints = formData.whoCanEnroll.pointsText.split('\n').map(s => s.trim()).filter(Boolean);
      const thingsPoints = formData.thingsToKnow.pointsText.split('\n').map(s => s.trim()).filter(Boolean);

      // Parse Career Opportunities
      const oppsArray = formData.careerOpportunitiesText.split('\n').map(s => s.trim()).filter(Boolean);

      // Parse Why Choose Us
      const whyPoints = formData.whyChooseYukti.pointsText.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        key: slug,
        slug: slug,
        title: formData.title.trim(),
        headline: (formData.headline || formData.title).trim(),
        category: formData.category,
        badge: formData.badge.trim(),
        tag: formData.badge.trim(),
        duration: formData.duration.trim(),
        description: formData.description.trim(),
        fullDescription: fullDescArray.length > 0 ? fullDescArray : [formData.description],
        highlights: highlightsArray,
        topics: highlightsArray,
        modulesCount: parsedCurriculum.length,

        // Rich Syllabus
        syllabusHeading: formData.syllabusHeading.trim(),
        curriculum: parsedCurriculum,
        modules: parsedCurriculum,

        // Different Approach & Benefits
        differentApproach: {
          heading: formData.differentApproach.heading.trim(),
          intro: formData.differentApproach.intro.trim(),
          points: formData.differentApproach.points
        },
        careerBenefitsHeading: formData.careerBenefitsHeading.trim(),
        careerBenefits: formData.careerBenefits,

        // Who Can Enroll & Things To Know
        whoCanEnroll: {
          heading: formData.whoCanEnroll.heading.trim(),
          intro: formData.whoCanEnroll.intro.trim(),
          points: whoPoints
        },
        thingsToKnow: {
          heading: formData.thingsToKnow.heading.trim(),
          intro: formData.thingsToKnow.intro.trim(),
          points: thingsPoints
        },

        // Careers
        showCareerOpportunitiesSection: !!formData.showCareerOpportunitiesSection,
        careerOpportunitiesHeading: formData.careerOpportunitiesHeading.trim(),
        careerOpportunities: oppsArray,
        careerRolesHeading: formData.careerRolesHeading.trim(),
        careerRolesTable: formData.careerRolesTable,

        // Why Choose Us & FAQs
        whyChooseYukti: {
          heading: formData.whyChooseYukti.heading.trim(),
          intro: formData.whyChooseYukti.intro.trim(),
          points: whyPoints
        },
        faqs: formData.faqs
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

  // Helper functions for dynamic array editing
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          moduleTitle: `Module ${prev.curriculum.length + 1}: New Specialized Module`,
          topicsText: 'Concept Overview\nImplementation Step 1\nImplementation Step 2\nLab Exercise'
        }
      ]
    }));
  };

  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  const updateModule = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.curriculum];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, curriculum: updated };
    });
  };

  const addApproachPoint = () => {
    setFormData(prev => ({
      ...prev,
      differentApproach: {
        ...prev.differentApproach,
        points: [
          ...prev.differentApproach.points,
          { title: 'New Key Differentiator', desc: 'Practical hands-on description for this point.' }
        ]
      }
    }));
  };

  const removeApproachPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      differentApproach: {
        ...prev.differentApproach,
        points: prev.differentApproach.points.filter((_, i) => i !== index)
      }
    }));
  };

  const updateApproachPoint = (index, field, value) => {
    setFormData(prev => {
      const points = [...prev.differentApproach.points];
      points[index] = { ...points[index], [field]: value };
      return {
        ...prev,
        differentApproach: { ...prev.differentApproach, points }
      };
    });
  };

  const addBenefitPoint = () => {
    setFormData(prev => ({
      ...prev,
      careerBenefits: [
        ...prev.careerBenefits,
        { title: `${prev.careerBenefits.length + 1}. Key Career Advantage`, desc: 'Explanation of how this benefits the candidate.' }
      ]
    }));
  };

  const removeBenefitPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      careerBenefits: prev.careerBenefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefitPoint = (index, field, value) => {
    setFormData(prev => {
      const benefits = [...prev.careerBenefits];
      benefits[index] = { ...benefits[index], [field]: value };
      return { ...prev, careerBenefits: benefits };
    });
  };

  const addCareerRole = () => {
    setFormData(prev => ({
      ...prev,
      careerRolesTable: [
        ...prev.careerRolesTable,
        {
          role: 'Target Job Profile',
          responsibilities: 'Core responsibility description and development focus.',
          skillsOrPackage: '₹5–12 LPA (Global: $60K–$100K/yr)'
        }
      ]
    }));
  };

  const removeCareerRole = (index) => {
    setFormData(prev => ({
      ...prev,
      careerRolesTable: prev.careerRolesTable.filter((_, i) => i !== index)
    }));
  };

  const updateCareerRole = (index, field, value) => {
    setFormData(prev => {
      const roles = [...prev.careerRolesTable];
      roles[index] = { ...roles[index], [field]: value };
      return { ...prev, careerRolesTable: roles };
    });
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: 'What is the format of the classes?',
          answer: 'We provide both hands-on classroom lab sessions in Greater Noida and interactive live online options.'
        }
      ]
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const updateFaq = (index, field, value) => {
    setFormData(prev => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.key || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (c.category || '').toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-brand-600" />
            <span>Course Management & Section Studio</span>
          </h1>
          <p className="text-xs text-slate-500">
            Create and edit complete courses with dynamic Syllabus Modules, Why Choose Us, FAQs, Career Roles & Benefits
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course Track</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search courses by name or slug..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Tracks</option>
            <option value="programming">Programming & Dev</option>
            <option value="fullstack">Full Stack & MERN</option>
            <option value="ai">AI & Data Science</option>
            <option value="databases">Database Systems</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">Loading courses from Firestore...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-900">
            {courses.length === 0 ? 'No Dynamic Courses in Firestore Yet' : 'No Courses Match Search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {courses.length === 0 
              ? 'The website is currently displaying the built-in core master syllabus tracks. Any custom courses you add here will be rendered with all sections (Syllabus, Why Choose, FAQs, etc.)!'
              : 'Try clearing your search filters to view all courses.'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500 cursor-pointer"
          >
            Add Course Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => {
            const modCount = c.curriculum?.length || c.modules?.length || c.modulesCount || 0;
            const faqCount = c.faqs?.length || 0;
            const roleCount = c.careerRolesTable?.length || 0;

            return (
              <div 
                key={c.id} 
                className="rounded-3xl bg-white border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between group hover:border-brand-300 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                      {c.badge || c.tag || 'Certified'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">{c.duration}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                      {c.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">/{c.key || c.slug}/</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description || 'Professional practical certification program.'}
                  </p>

                  {/* Section Metrics Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      <Layers className="w-3 h-3 text-brand-500" />
                      <span>{modCount} Modules</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      <Briefcase className="w-3 h-3 text-amber-500" />
                      <span>{roleCount} Roles</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      <HelpCircle className="w-3 h-3 text-emerald-500" />
                      <span>{faqCount} FAQs</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(c)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Full Sections</span>
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Massive Full-Course Modal with Section Tabs */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[90vh] max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-brand-50/30 z-20">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
                  {editingCourse ? 'Course Editor Studio' : 'Course Creator Studio'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-lg">
                  {editingCourse ? `Edit: ${formData.title || 'Course'}` : 'Add Complete Course with All Sections'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (shrink-0, Sleek Segmented Pill Bar) */}
            <div className="shrink-0 bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 py-2.5 z-20">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'basic', label: '1. Basic Info', count: null },
                  { id: 'syllabus', label: '2. Syllabus', count: formData.curriculum.length },
                  { id: 'approach', label: '3. Approach & Benefits', count: null },
                  { id: 'eligibility', label: '4. Eligibility', count: null },
                  { id: 'careers', label: '5. Careers & Roles', count: formData.careerRolesTable.length },
                  { id: 'why_faqs', label: '6. Why Us & FAQs', count: formData.faqs.length }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm font-extrabold'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                          isActive ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6">

              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Course Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const t = e.target.value;
                          setFormData({ 
                            ...formData, 
                            title: t,
                            key: formData.key || t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                          });
                        }}
                        placeholder="e.g. React JS Training Institute in Greater Noida"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">URL Slug / Course Key *</label>
                      <input
                        type="text"
                        required
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                        placeholder="e.g. react-js or mern-stack"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Headline / Subtitle</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="e.g. React JS Training Institute in Greater Noida with Internship Opportunities"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-500"
                      >
                        <option value="programming">Programming & Dev</option>
                        <option value="fullstack">Full Stack & MERN</option>
                        <option value="ai">AI & Data Science</option>
                        <option value="databases">Database Systems</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 4 - 6 Months"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Badge / Tag</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Accredited Certification"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Short Overview (used in cards & meta)</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Concise 2-sentence summary of the course..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Description Paragraphs (separate paragraphs with blank line)</label>
                    <textarea
                      rows={3}
                      value={formData.fullDescriptionText}
                      onChange={(e) => setFormData({ ...formData, fullDescriptionText: e.target.value })}
                      placeholder="In-depth explanation of the training track, practical learning methodology, and real-world exposure..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Quick Bullet Highlights (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.highlightsText}
                      onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                      placeholder="100% Practical Labs&#10;Live Enterprise Capstone&#10;1-on-1 Mentorship"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SYLLABUS & MODULES */}
              {activeTab === 'syllabus' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Syllabus Section Heading</label>
                    <input
                      type="text"
                      value={formData.syllabusHeading}
                      onChange={(e) => setFormData({ ...formData, syllabusHeading: e.target.value })}
                      placeholder="e.g. Course Curriculum & Practical Modules"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      Course Modules ({formData.curriculum.length})
                    </span>
                    <button
                      type="button"
                      onClick={addModule}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.curriculum.map((mod, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative group">
                        <div className="flex items-center justify-between gap-3">
                          <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white font-black text-[10px] shrink-0">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={mod.moduleTitle}
                            onChange={(e) => updateModule(idx, 'moduleTitle', e.target.value)}
                            placeholder={`Module ${idx + 1}: Module Title`}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeModule(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">Topics in this Module (one topic per line)</label>
                          <textarea
                            rows={3}
                            value={mod.topicsText}
                            onChange={(e) => updateModule(idx, 'topicsText', e.target.value)}
                            placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: APPROACH & BENEFITS */}
              {activeTab === 'approach' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* How This Course Takes a Different Approach */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Different Approach - Section Heading</label>
                      <input
                        type="text"
                        value={formData.differentApproach.heading}
                        onChange={(e) => setFormData({
                          ...formData,
                          differentApproach: { ...formData.differentApproach, heading: e.target.value }
                        })}
                        placeholder="How This Course Takes a Different Approach"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Different Approach - Intro Paragraph</label>
                      <textarea
                        rows={2}
                        value={formData.differentApproach.intro}
                        onChange={(e) => setFormData({
                          ...formData,
                          differentApproach: { ...formData.differentApproach, intro: e.target.value }
                        })}
                        placeholder="Introductory paragraph explaining practical methodology..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black uppercase text-slate-500">Key Differentiator Points</span>
                      <button
                        type="button"
                        onClick={addApproachPoint}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-brand-600 font-bold text-xs hover:bg-brand-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Point</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.differentApproach.points.map((pt, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={pt.title}
                              onChange={(e) => updateApproachPoint(idx, 'title', e.target.value)}
                              placeholder="Point Title (e.g. Industry Curriculum)"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeApproachPoint(idx)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={pt.desc}
                            onChange={(e) => updateApproachPoint(idx, 'desc', e.target.value)}
                            placeholder="Description of this differentiator..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career Benefits */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Career Benefits - Section Heading</label>
                      <input
                        type="text"
                        value={formData.careerBenefitsHeading}
                        onChange={(e) => setFormData({ ...formData, careerBenefitsHeading: e.target.value })}
                        placeholder="Benefits of Enrolling in Our Complete Course"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black uppercase text-slate-500">Benefit Cards</span>
                      <button
                        type="button"
                        onClick={addBenefitPoint}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-brand-600 font-bold text-xs hover:bg-brand-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Benefit</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.careerBenefits.map((b, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={b.title}
                              onChange={(e) => updateBenefitPoint(idx, 'title', e.target.value)}
                              placeholder={`Benefit Title (e.g. ${idx + 1}. Practical Learning)`}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeBenefitPoint(idx)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={b.desc}
                            onChange={(e) => updateBenefitPoint(idx, 'desc', e.target.value)}
                            placeholder="Benefit explanation..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ELIGIBILITY & PREREQUISITES */}
              {activeTab === 'eligibility' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Who Can Enroll */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Who Can Enroll - Section Heading</label>
                      <input
                        type="text"
                        value={formData.whoCanEnroll.heading}
                        onChange={(e) => setFormData({
                          ...formData,
                          whoCanEnroll: { ...formData.whoCanEnroll, heading: e.target.value }
                        })}
                        placeholder="Who Can Consider Enrolling in Our Certified Course?"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Intro Paragraph</label>
                      <textarea
                        rows={2}
                        value={formData.whoCanEnroll.intro}
                        onChange={(e) => setFormData({
                          ...formData,
                          whoCanEnroll: { ...formData.whoCanEnroll, intro: e.target.value }
                        })}
                        placeholder="Introductory text describing target audience..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Eligible Profiles / Points (one per line)</label>
                      <textarea
                        rows={5}
                        value={formData.whoCanEnroll.pointsText}
                        onChange={(e) => setFormData({
                          ...formData,
                          whoCanEnroll: { ...formData.whoCanEnroll, pointsText: e.target.value }
                        })}
                        placeholder="College Students (B.Tech, BCA, MCA)&#10;Fresh graduates looking to start developer careers&#10;Working professionals switching tech stacks"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Things You Need to Know */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Things to Know - Section Heading</label>
                      <input
                        type="text"
                        value={formData.thingsToKnow.heading}
                        onChange={(e) => setFormData({
                          ...formData,
                          thingsToKnow: { ...formData.thingsToKnow, heading: e.target.value }
                        })}
                        placeholder="Things You Need to Know Before Enrolling"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Intro Paragraph</label>
                      <textarea
                        rows={2}
                        value={formData.thingsToKnow.intro}
                        onChange={(e) => setFormData({
                          ...formData,
                          thingsToKnow: { ...formData.thingsToKnow, intro: e.target.value }
                        })}
                        placeholder="Introductory text about curriculum expectations..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Key Points & Prerequisites (one per line)</label>
                      <textarea
                        rows={5}
                        value={formData.thingsToKnow.pointsText}
                        onChange={(e) => setFormData({
                          ...formData,
                          thingsToKnow: { ...formData.thingsToKnow, pointsText: e.target.value }
                        })}
                        placeholder="No prior coding experience mandatory&#10;Flexible morning & weekend batches available&#10;Hands-on project work after each module"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CAREERS & SALARY ROLES */}
              {activeTab === 'careers' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Career Scope Section */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showCareerSection"
                        checked={formData.showCareerOpportunitiesSection}
                        onChange={(e) => setFormData({ ...formData, showCareerOpportunitiesSection: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="showCareerSection" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Enable "Career Opportunities" Section on Course Page
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Career Scope Heading</label>
                      <input
                        type="text"
                        value={formData.careerOpportunitiesHeading}
                        onChange={(e) => setFormData({ ...formData, careerOpportunitiesHeading: e.target.value })}
                        placeholder="Career Opportunities After Learning This Course"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Career Roles / Opportunity Pills (one per line)</label>
                      <textarea
                        rows={4}
                        value={formData.careerOpportunitiesText}
                        onChange={(e) => setFormData({ ...formData, careerOpportunitiesText: e.target.value })}
                        placeholder="Frontend Developer&#10;Backend Engineer&#10;Full Stack Software Engineer&#10;Technical Lead"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* High Paying Roles Table */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Roles Table Heading</label>
                      <input
                        type="text"
                        value={formData.careerRolesHeading}
                        onChange={(e) => setFormData({ ...formData, careerRolesHeading: e.target.value })}
                        placeholder="High-Paying Roles & Industry Scope [Jobs]"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black uppercase text-slate-500">
                        Target Job Profiles & Packages ({formData.careerRolesTable.length})
                      </span>
                      <button
                        type="button"
                        onClick={addCareerRole}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-brand-600 font-bold text-xs hover:bg-brand-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Job Role</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.careerRolesTable.map((role, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={role.role}
                              onChange={(e) => updateCareerRole(idx, 'role', e.target.value)}
                              placeholder="Job Profile (e.g. Full Stack Developer)"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeCareerRole(idx)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={role.responsibilities}
                            onChange={(e) => updateCareerRole(idx, 'responsibilities', e.target.value)}
                            placeholder="Key Responsibility details..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                          />

                          <input
                            type="text"
                            value={role.skillsOrPackage}
                            onChange={(e) => updateCareerRole(idx, 'skillsOrPackage', e.target.value)}
                            placeholder="Package (e.g. ₹5–12 LPA (Global: $60K–$100K/yr))"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs font-bold text-emerald-800 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: WHY CHOOSE US & FAQS */}
              {activeTab === 'why_faqs' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Why Choose Us */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Why Choose Us - Heading</label>
                      <input
                        type="text"
                        value={formData.whyChooseYukti.heading}
                        onChange={(e) => setFormData({
                          ...formData,
                          whyChooseYukti: { ...formData.whyChooseYukti, heading: e.target.value }
                        })}
                        placeholder="Why Choose Yukti Software?"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Intro Paragraph</label>
                      <textarea
                        rows={2}
                        value={formData.whyChooseYukti.intro}
                        onChange={(e) => setFormData({
                          ...formData,
                          whyChooseYukti: { ...formData.whyChooseYukti, intro: e.target.value }
                        })}
                        placeholder="Intro text highlighting institute strengths..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Why Choose Us Points (one per line)</label>
                      <textarea
                        rows={5}
                        value={formData.whyChooseYukti.pointsText}
                        onChange={(e) => setFormData({
                          ...formData,
                          whyChooseYukti: { ...formData.whyChooseYukti, pointsText: e.target.value }
                        })}
                        placeholder="Hands-on training with experienced industry mentors&#10;Portfolio projects reviewed by tech leads&#10;Placement guidance, resume building, and mock interviews"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-500">
                        Frequently Asked Questions ({formData.faqs.length})
                      </span>
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-brand-600 font-bold text-xs hover:bg-brand-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add FAQ</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.faqs.map((faq, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                              placeholder={`Q${idx + 1}: Question title`}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeFaq(idx)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                            placeholder="Detailed FAQ answer..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Close Scrollable Form Body */}
              </div>

              {/* Pinned Modal Footer */}
              <div className="shrink-0 px-6 py-3.5 border-t border-slate-200/80 bg-slate-50/90 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'syllabus', 'approach', 'eligibility', 'careers', 'why_faqs'];
                        const currIdx = tabs.indexOf(activeTab);
                        if (currIdx > 0) setActiveTab(tabs[currIdx - 1]);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeTab !== 'why_faqs' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'syllabus', 'approach', 'eligibility', 'careers', 'why_faqs'];
                        const currIdx = tabs.indexOf(activeTab);
                        if (currIdx < tabs.length - 1) setActiveTab(tabs[currIdx + 1]);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer"
                    >
                      Next Section →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)} 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-primary hover:from-brand-500 hover:to-accent-primary text-white font-extrabold text-xs shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Saving Course...' : editingCourse ? 'Update All Course Sections' : 'Publish Complete Course'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
