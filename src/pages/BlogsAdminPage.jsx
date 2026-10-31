import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  X, 
  Trash2, 
  Edit3, 
  Eye, 
  Code, 
  Upload, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  BookOpen, 
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Table as TableIcon,
  RotateCcw,
  RotateCw,
  Share2,
  Bookmark,
  Check
} from 'lucide-react';
import { getCollectionItems, addItem, updateItem, deleteItem } from '../services/adminService';
import { renderBlogContent, cleanAndNormalizeHtml } from '../utils/blogRenderer';

// Default initial articles matching main website
const INITIAL_BLOG_TEMPLATES = [
  {
    title: 'Top 10 Java and Spring Boot Interview Questions for 2026',
    slug: 'top-java-spring-boot-interview-questions',
    category: 'Java & Backend',
    author: 'Mithilesh Kumar (CTO)',
    readTime: '6 min read',
    excerpt: 'Master tricky interview questions covering Spring Boot Microservices, multithreading, garbage collection, and Hibernate optimization with real code answers.',
    tags: 'Java, Spring Boot, Backend, Interviews',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=70',
    content: `## Essential Java & Spring Boot Interview Preparation for 2026\n\nIn modern enterprise software engineering, cracking senior Java and backend developer rounds requires a solid grasp of **Spring Boot 3, Microservices Architecture, Concurrency, and Low-Latency Optimization**.\n\n### 1. How does Spring Boot 3 leverage Virtual Threads (Project Loom)?\nVirtual threads in Java 21+ are lightweight threads managed by the JVM rather than the OS. In Spring Boot 3, enabling virtual threads allows high throughput for I/O-heavy REST endpoints without thread pool exhaustion.\n\n\`\`\`java\n// Enable virtual threads in application.properties\nspring.threads.virtual.enabled=true\n\`\`\`\n\n### 2. Microservices Resiliency with Resilience4j\nCircuit breaking, rate limiting, and retry policies prevent cascading failures in distributed systems.\n\n### Key Takeaways\n- Always prepare practical hands-on examples.\n- Focus on architecture patterns over plain syntax memorization.\n- Mention real deployment setups (Docker, Kubernetes, AWS).`,
    seo: {
      metaTitle: 'Top 10 Java and Spring Boot Interview Questions for 2026 | Yukti Software',
      focusKeyword: 'Java Spring Boot Interview Questions',
      metaDescription: 'Master tricky interview questions covering Spring Boot Microservices, multithreading, garbage collection, and Hibernate optimization with real code answers.',
      canonicalUrl: 'https://www.yuktisoftware.com/blogs/top-java-spring-boot-interview-questions/',
      isIndex: true,
      isFollow: true,
      ogTitle: 'Top 10 Java and Spring Boot Interview Questions for 2026',
      ogImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=70',
      ogDescription: 'Master tricky interview questions covering Spring Boot Microservices, multithreading, garbage collection, and Hibernate optimization with real code answers.',
      customJsonLd: ''
    }
  },
  {
    title: 'How to Build and Deploy Full-Stack AI Agents with LangChain & Python',
    slug: 'build-deploy-full-stack-ai-agents',
    category: 'AI & Machine Learning',
    author: 'AI Innovation Faculty',
    readTime: '8 min read',
    excerpt: 'A step-by-step practical tutorial to crafting autonomous multi-agent systems, integrating vector databases with RAG, and containerizing with Docker.',
    tags: 'Python, Generative AI, LangChain, RAG',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=700&q=70',
    content: `## Building Production-Ready AI Agents with LangChain & Python\n\nGenerative AI has evolved beyond simple chatbots into **autonomous agents** that interact with APIs, perform multi-step planning, and retrieve enterprise data using Retrieval-Augmented Generation (RAG).\n\n### Architecture of an AI Agent\n1. **LLM Core**: Reasoning engine (GPT-4o, Claude 3.5, or Llama 3).\n2. **Vector Store**: Semantic retrieval using ChromaDB or Pinecone.\n3. **Tools & APIs**: SQL execution, web search, code interpreters.\n\n\`\`\`python\nfrom langchain.agents import initialize_agent, Tool\nfrom langchain_openai import ChatOpenAI\n\nllm = ChatOpenAI(model="gpt-4o", temperature=0)\n# Define custom tools for enterprise data retrieval\n\`\`\`\n\nYukti Software provides in-depth hands-on labs in Greater Noida to build end-to-end AI applications.`,
    seo: {
      metaTitle: 'How to Build and Deploy Full-Stack AI Agents with LangChain & Python | Yukti Software',
      focusKeyword: 'Build Deploy Full Stack AI Agents LangChain Python',
      metaDescription: 'A step-by-step practical tutorial to crafting autonomous multi-agent systems, integrating vector databases with RAG, and containerizing with Docker.',
      canonicalUrl: 'https://www.yuktisoftware.com/blogs/build-deploy-full-stack-ai-agents/',
      isIndex: true,
      isFollow: true,
      ogTitle: 'How to Build and Deploy Full-Stack AI Agents with LangChain & Python',
      ogImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=700&q=70',
      ogDescription: 'A step-by-step practical tutorial to crafting autonomous multi-agent systems, integrating vector databases with RAG, and containerizing with Docker.',
      customJsonLd: ''
    }
  }
];

const CATEGORIES = [
  'Java & Backend',
  'AI & Machine Learning',
  'Web Development',
  'Data Structures & Algorithms',
  'Database Engineering',
  'Career & Industry',
  'Cloud & DevOps',
  'Software Testing & QA',
  'Cybersecurity & Networking'
];

export default function BlogsAdminPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor'
  const [editorTab, setEditorTab] = useState('code'); // 'visual' | 'code'
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  // Search & Filter in list view
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterFeatured, setFilterFeatured] = useState('ALL');

  // Form State matching the exact reference UI
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    author: 'Yukti Editorial Team',
    tags: '',
    isFeatured: false,
    coverImage: '',
    content: '',
    // SEO fields
    metaTitle: '',
    focusKeyword: '',
    metaDescription: '',
    canonicalUrl: '',
    isIndex: true,
    isFollow: true,
    ogTitle: '',
    ogImageUrl: '',
    ogDescription: '',
    customJsonLd: ''
  });

  const fileInputRef = useRef(null);
  const contentTextareaRef = useRef(null);

  // Helper to slugify text
  const slugify = (text = '') => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getCollectionItems('blogs', 'createdAt', 'desc');
      if (data && data.length > 0) {
        setBlogs(data);
      } else {
        // Fallback to local templates if collection is empty
        setBlogs(INITIAL_BLOG_TEMPLATES.map((item, idx) => ({ id: `default-${idx}`, ...item })));
      }
    } catch (err) {
      console.warn('Could not load Firestore blogs, using defaults:', err);
      setBlogs(INITIAL_BLOG_TEMPLATES.map((item, idx) => ({ id: `default-${idx}`, ...item })));
    } finally {
      setLoading(false);
    }
  };

  // Open Blank Form for New Post
  const handleOpenNewPost = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      category: '',
      author: 'Yukti Editorial Team',
      tags: '',
      isFeatured: false,
      coverImage: '',
      content: '',
      metaTitle: '',
      focusKeyword: '',
      metaDescription: '',
      canonicalUrl: '',
      isIndex: true,
      isFollow: true,
      ogTitle: '',
      ogImageUrl: '',
      ogDescription: '',
      customJsonLd: ''
    });
    setEditorTab('code');
    setViewMode('editor');
  };

  // Open Form to Edit an Existing Post
  const handleOpenEdit = (post) => {
    setEditingId(post.id);
    const seo = post.seo || {};
    setForm({
      title: post.title || '',
      slug: post.slug || slugify(post.title || ''),
      excerpt: post.excerpt || '',
      category: post.category || '',
      author: post.author || 'Yukti Editorial Team',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      isFeatured: !!post.isFeatured,
      coverImage: post.coverImage || post.image || '',
      content: post.content || '',
      metaTitle: seo.metaTitle || post.metaTitle || '',
      focusKeyword: seo.focusKeyword || post.focusKeyword || '',
      metaDescription: seo.metaDescription || post.metaDescription || '',
      canonicalUrl: seo.canonicalUrl || post.canonicalUrl || '',
      isIndex: seo.isIndex !== undefined ? seo.isIndex : true,
      isFollow: seo.isFollow !== undefined ? seo.isFollow : true,
      ogTitle: seo.ogTitle || post.ogTitle || '',
      ogImageUrl: seo.ogImageUrl || post.ogImageUrl || '',
      ogDescription: seo.ogDescription || post.ogDescription || '',
      customJsonLd: seo.customJsonLd || post.customJsonLd || ''
    });
    setViewMode('editor');
  };

  // Auto-slugify when typing title
  const handleTitleChange = (val) => {
    setForm(prev => {
      const isSlugPristine = !prev.slug || prev.slug === slugify(prev.title);
      return {
        ...prev,
        title: val,
        slug: isSlugPristine ? slugify(val) : prev.slug
      };
    });
  };

  // Cover image upload via file reader (base64)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size should ideally be under 2MB for fast loading.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setForm(prev => ({
        ...prev,
        coverImage: base64Url
      }));
    };
    reader.readAsDataURL(file);
  };

  // Toolbar Formatting Actions
  const insertFormatting = (prefix, suffix = '', defaultPlaceholder = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || defaultPlaceholder;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setForm(prev => ({ ...prev, content: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Calculate estimated reading time
  const calculateReadTime = (text = '', excerpt = '') => {
    const totalWords = (text + ' ' + excerpt).trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    return `${minutes} min read`;
  };

  // Save Post to Firestore
  const handleSavePost = async (e) => {
    if (e) e.preventDefault();

    if (!form.title.trim()) {
      alert('Please provide a Title for the blog post.');
      return;
    }

    if (!form.category) {
      alert('Please select a Category.');
      return;
    }

    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const cleanSlug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);
      const tagList = (form.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const readTime = calculateReadTime(form.content, form.excerpt);
      const postDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      // SEO fallbacks
      const finalMetaTitle = form.metaTitle.trim() || `${form.title.trim()} | Yukti Software Greater Noida`;
      const finalMetaDescription = form.metaDescription.trim() || form.excerpt.trim();
      const finalCanonicalUrl = form.canonicalUrl.trim() || `https://www.yuktisoftware.com/blogs/${cleanSlug}/`;
      const finalOgTitle = form.ogTitle.trim() || finalMetaTitle;
      const finalOgImage = form.ogImageUrl.trim() || form.coverImage || 'https://www.yuktisoftware.com/favicon.svg';
      const finalOgDesc = form.ogDescription.trim() || finalMetaDescription;

      const payload = {
        title: form.title.trim(),
        slug: cleanSlug,
        excerpt: form.excerpt.trim(),
        category: form.category,
        author: form.author.trim() || 'Yukti Editorial Team',
        tags: tagList,
        isFeatured: !!form.isFeatured,
        coverImage: form.coverImage || '',
        image: form.coverImage || '', // Compatibility with main website cards
        content: form.content.trim(),
        readTime: readTime,
        date: postDate,
        status: 'published',
        seo: {
          metaTitle: finalMetaTitle,
          focusKeyword: form.focusKeyword.trim(),
          metaDescription: finalMetaDescription,
          canonicalUrl: finalCanonicalUrl,
          isIndex: form.isIndex,
          isFollow: form.isFollow,
          ogTitle: finalOgTitle,
          ogImageUrl: finalOgImage,
          ogDescription: finalOgDesc,
          customJsonLd: form.customJsonLd.trim()
        }
      };

      if (editingId && !editingId.startsWith('default-')) {
        await updateItem('blogs', editingId, payload);
        setFeedback({ type: 'success', message: 'Blog post updated successfully in Firebase!' });
      } else {
        await addItem('blogs', payload);
        setFeedback({ type: 'success', message: 'New blog post published successfully to Firebase!' });
      }

      await loadBlogs();
      setTimeout(() => {
        setViewMode('list');
        setFeedback({ type: '', message: '' });
      }, 1500);

    } catch (err) {
      console.error('Error saving blog post:', err);
      setFeedback({ type: 'error', message: 'Failed to save post: ' + (err.message || 'Unknown error') });
    } finally {
      setSaving(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        if (!id.startsWith('default-')) {
          await deleteItem('blogs', id);
        }
        setBlogs(prev => prev.filter(b => b.id !== id));
        setFeedback({ type: 'success', message: 'Blog post deleted successfully!' });
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
      } catch (err) {
        alert('Failed to delete post: ' + err.message);
      }
    }
  };

  // Filtered blogs for list view
  const filteredBlogs = blogs.filter(b => {
    const q = searchTerm.toLowerCase();
    const titleMatch = (b.title || '').toLowerCase().includes(q);
    const excerptMatch = (b.excerpt || '').toLowerCase().includes(q);
    const authorMatch = (b.author || '').toLowerCase().includes(q);
    const tagMatch = Array.isArray(b.tags) ? b.tags.some(t => t.toLowerCase().includes(q)) : String(b.tags || '').toLowerCase().includes(q);
    const matchesSearch = !q || titleMatch || excerptMatch || authorMatch || tagMatch;

    const matchesCat = filterCategory === 'ALL' || b.category === filterCategory;
    const matchesFeatured = filterFeatured === 'ALL' || (filterFeatured === 'FEATURED' ? b.isFeatured : !b.isFeatured);

    return matchesSearch && matchesCat && matchesFeatured;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">

      {/* Global Feedback Banner */}
      {feedback.message && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fadeIn ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HEADER: Exact match with Reference Image */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          {viewMode === 'editor' && (
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Back to Blog List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Admin Blog Management
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenNewPost}
          className="px-5 py-2.5 rounded-xl bg-[#198754] hover:bg-[#157347] active:bg-[#146c43] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE: EDITOR (Matches attached reference design exactly) */}
      {/* ========================================================================= */}
      {viewMode === 'editor' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 animate-fadeIn">
          
          <form onSubmit={handleSavePost} className="space-y-6">

            {/* Row 1: Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Modern Full Stack Roadmap 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="e.g. modern-full-stack-roadmap-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2: Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Excerpt <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a compelling 2-3 sentence overview for search previews and blog card summaries..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Row 3: Category, Author, Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Author <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="e.g. Mithilesh Kumar (CTO)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., python, machine learning, ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Checkbox: Mark as featured */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="mark-featured"
                checked={form.isFeatured}
                onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="mark-featured" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Mark as featured
              </label>
            </div>

            {/* Cover Image Upload & URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Cover Image
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload cover image</span>
                </button>

                <div className="flex-1 min-w-[240px]">
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="Or paste direct image URL (Unsplash, Cloudinary, AWS S3)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Cover Image Preview */}
              {form.coverImage && (
                <div className="relative mt-2 w-full max-w-md h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                  <img
                    src={form.coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=70';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    title="Remove Cover Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Content with Rich Text Toolbar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Content
              </label>

              {/* Toolbar */}
              <div className="bg-slate-50 border border-slate-200 rounded-t-2xl p-2 flex flex-wrap items-center justify-between gap-2 text-slate-700">
                
                {/* Formatting controls */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**', 'bold text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*', 'italic text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('~~', '~~', 'strikethrough text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>

                  <span className="h-4 w-px bg-slate-300 mx-1" />

                  {/* Heading selector */}
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) insertFormatting(val + ' ', '\n', 'Heading Text');
                      e.target.value = '';
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <option value="">Paragraph ▾</option>
                    <option value="# ">Heading 1</option>
                    <option value="## ">Heading 2</option>
                    <option value="### ">Heading 3</option>
                    <option value="">Standard Paragraph</option>
                  </select>

                  <span className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ', '\n', 'List item')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n1. ', '\n', 'Numbered item')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n> ', '\n', 'Quote text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Blockquote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n```\n', '\n```\n', '// code snippet here')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-mono font-bold"
                    title="Code Block"
                  >
                    &lt;&gt;
                  </button>

                  <span className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('[', '](https://example.com)', 'Link Text')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('![Image Alt](', ')', 'https://images.unsplash.com/...')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n| Feature | Details |\n|---|---|\n| Item 1 | Value 1 |\n')}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-xs font-bold"
                    title="Insert Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>

                  <span className="h-4 w-px bg-slate-300 mx-1" />

                  {/* Clean & Normalize Typography Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.content) return;
                      const cleaned = cleanAndNormalizeHtml(form.content);
                      setForm(prev => ({ ...prev, content: cleaned }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center space-x-1 border border-emerald-200 transition-colors"
                    title="Clean HTML boilerplate, strip invasive inline fonts, and standardize typography"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Clean & Format HTML</span>
                  </button>
                </div>

                {/* View switcher on the right */}
                <div className="flex items-center space-x-1 bg-white p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      // Automatically strip document wrappers (<!DOCTYPE>, <html>, <head>, <body>) on switching to visual
                      if (form.content && (form.content.includes('<!DOCTYPE') || form.content.includes('<html') || form.content.includes('<head'))) {
                        setForm(prev => ({ ...prev, content: cleanAndNormalizeHtml(prev.content) }));
                      }
                      setEditorTab('visual');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      editorTab === 'visual'
                        ? 'bg-[#198754] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('code')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      editorTab === 'code'
                        ? 'bg-[#198754] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </button>
                </div>

              </div>

              {/* Editor Box */}
              {editorTab === 'code' ? (
                <textarea
                  ref={contentTextareaRef}
                  required
                  rows={16}
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content using markdown or HTML syntax. Use headings (## or <h2>), code snippets (``` or <pre>), bullet lists, and paragraphs..."
                  className="w-full p-4 rounded-b-2xl bg-white border border-t-0 border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed"
                />
              ) : (
                <div className="w-full min-h-[420px] p-6 sm:p-8 rounded-b-2xl bg-white border border-t-0 border-slate-200 overflow-y-auto">
                  {form.content ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                          <Eye className="w-3.5 h-3.5" /> Live Visual Article UI (Formatted as readers will see it)
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditorTab('code')}
                          className="hover:text-slate-700 underline cursor-pointer"
                        >
                          Switch to Code mode to edit HTML
                        </button>
                      </div>
                      {renderBlogContent(form.content)}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-sm font-medium">No content written yet.</p>
                      <p className="text-xs">Switch to Code mode to write or paste your HTML/Markdown article.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <hr className="border-slate-200 my-8" />

            {/* ================================================================= */}
            {/* SEO SECTION: Matches attached reference design */}
            {/* ================================================================= */}
            <div className="space-y-5">
              <h3 className="text-base font-bold text-slate-900">
                SEO
              </h3>

              {/* Row 1: Meta Title & Focus Keyword */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="Falls back to post title"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={form.focusKeyword}
                    onChange={(e) => setForm(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="e.g. farmhouse investment guide"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 2: Meta Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Falls back to the excerpt"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Row 3: Canonical URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={form.canonicalUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                  placeholder="Leave blank to auto-generate from the slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Row 4: Index & Follow checkboxes */}
              <div className="flex items-center space-x-5 pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seo-index"
                    checked={form.isIndex}
                    onChange={(e) => setForm(prev => ({ ...prev, isIndex: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="seo-index" className="text-xs font-bold text-slate-700 cursor-pointer select-none flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> Index
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seo-follow"
                    checked={form.isFollow}
                    onChange={(e) => setForm(prev => ({ ...prev, isFollow: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="seo-follow" className="text-xs font-bold text-slate-700 cursor-pointer select-none flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> Follow
                  </label>
                </div>
              </div>

              {/* Row 5: OG Title & OG Image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={form.ogTitle}
                    onChange={(e) => setForm(prev => ({ ...prev, ogTitle: e.target.value }))}
                    placeholder="Falls back to meta title"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    value={form.ogImageUrl}
                    onChange={(e) => setForm(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                    placeholder="Falls back to the cover image"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 6: OG Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  value={form.ogDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, ogDescription: e.target.value }))}
                  placeholder="Falls back to meta description"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Row 7: Custom JSON-LD (advanced) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Custom JSON-LD (advanced)
                </label>
                <textarea
                  rows={3}
                  value={form.customJsonLd}
                  onChange={(e) => setForm(prev => ({ ...prev, customJsonLd: e.target.value }))}
                  placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

            </div>

            {/* Bottom Form Action Buttons */}
            <div className="flex items-center space-x-3 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-[#198754] hover:bg-[#157347] active:bg-[#146c43] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer text-center"
              >
                {saving ? 'Saving to Firebase...' : (editingId ? 'Update Post' : 'Save Post')}
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODE: LIST (Blog Articles Management Dashboard) */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-6">

          {/* Search, Filter & Stats Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles by title, author, keyword or tag..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Posts</option>
                  <option value="FEATURED">Featured Only</option>
                  <option value="STANDARD">Standard Posts</option>
                </select>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Total Articles: <strong className="text-slate-800">{blogs.length}</strong></span>
              <span>•</span>
              <span>Showing: <strong className="text-slate-800">{filteredBlogs.length}</strong></span>
              <span>•</span>
              <span>Featured: <strong className="text-emerald-700">{blogs.filter(b => b.isFeatured).length}</strong></span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Synced directly with Firebase Firestore</span>
            </div>

          </div>

          {/* Posts Table / Card Grid */}
          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
              Loading blog posts from Firebase...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No blog posts found matching your filter</p>
              <button
                onClick={handleOpenNewPost}
                className="px-4 py-2 rounded-xl bg-[#198754] text-white text-xs font-bold hover:bg-[#157347]"
              >
                Create New Post Now
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Post & Slug</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {filteredBlogs.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Title & Thumbnail */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <img
                                src={post.coverImage || post.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=150&q=70'}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=150&q=70';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 line-clamp-1 text-sm hover:text-emerald-700">
                                {post.title}
                              </p>
                              <p className="font-mono text-[11px] text-slate-400 truncate">
                                /blogs/{post.slug}/
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {post.category || 'General'}
                          </span>
                        </td>

                        {/* Author */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {post.author || 'Yukti Editorial'}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                          <p className="font-bold text-slate-700">{post.date || 'Recent'}</p>
                          <p className="text-[10px]">{post.readTime || '5 min read'}</p>
                        </td>

                        {/* Featured Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {post.isFeatured ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1 w-max">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>Featured</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Standard</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
