import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import aiService from '../services/ai.service';
import {
  FolderKanban,
  CheckCircle2,
  Star,
  Clock,
  BookOpen,
  Briefcase,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'p-default-1',
    title: 'منصة إدارة وتتبع المهام التفاعلية (TaskFlow)',
    description: 'تطبيق ويب متكامل لإدارة المشاريع يدعم لوحات كانبان، التنبيهات الفورية، وإحصائيات إنجاز الفريق.',
    techStack: ['React', 'Node.js', 'TailwindCSS', 'MongoDB'],
    link: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    createdAt: 'منذ أسبوع',
  },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'portfolio' | 'add-project'

  // اتجاهات السوق بالذكاء الاصطناعي
  const [marketTrends, setMarketTrends] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(true);

  // معرض الأعمال وإدارة المشاريع
  const storageKey = `sb_portfolio_${user?._id || user?.id || 'guest'}`;
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    link: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const readiness = user?.careerReadinessScore ?? 75;
  const progress = user?.learningPathProgress ?? 60;
  const canGoFreelance = readiness >= 80 && progress >= 70;
  const userSkills = (user?.skills || []).length > 0 ? user.skills : ['JavaScript', 'React', 'Node.js', 'Git'];

  useEffect(() => {
    const fetchMarketTrends = async () => {
      try {
        setTrendsLoading(true);
        const data = await aiService.getMarketPredictions();
        setMarketTrends(data || []);
      } catch (err) {
        console.warn('Market trends fetch failed:', err.message);
      } finally {
        setTrendsLoading(false);
      }
    };
    fetchMarketTrends();
  }, []);

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedProjects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  };

  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!projectForm.title.trim()) errors.title = 'عنوان المشروع مطلوب';
    if (!projectForm.description.trim()) errors.description = 'وصف المشروع مطلوب';
    if (!projectForm.techStack.trim()) errors.techStack = 'أدخل التقنيات المستخدمة (مفصولة بفواصل)';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const parsedTechStack = projectForm.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject = {
      id: `p-${Date.now()}`,
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      techStack: parsedTechStack.length > 0 ? parsedTechStack : ['تطوير برمجيات'],
      link: projectForm.link.trim(),
      image: projectForm.image.trim(),
      createdAt: 'الآن',
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);

    setProjectForm({
      title: '',
      description: '',
      techStack: '',
      link: '',
      image: '',
    });
    setSubmitting(false);
    setSuccessMessage('تمت إضافة المشروع بنجاح إلى معرض أعمالك! 🎉');

    setTimeout(() => {
      setActiveTab('portfolio');
      setSuccessMessage('');
    }, 1000);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع من معرض أعمالك؟')) {
      const updated = projects.filter((p) => p.id !== projectId);
      saveProjects(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Ambient glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-4 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>لوحة تحكم الطالب المهنية والجاهزية الأكاديمية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
              مرحباً، <span className="bg-gradient-to-l from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{user?.fullName || 'طالب متميز'}</span> 👋
            </h1>
            <p className="text-sm text-slate-400">إليك ملخص مؤشرات جاهزيتك ونشاطك المهني والأكاديمي ومشاريعك الحالية</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/learning"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>أكمل مسار التعلم</span>
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-[#13161e] hover:bg-[#1a1f2c] text-slate-200 border border-slate-700/80 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:border-slate-600 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>تصفح المشاريع المتاحة</span>
            </Link>
          </div>
        </div>

        {/* Can Go Freelance Notification */}
        {canGoFreelance ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تهانينا! ملفك مؤهل بالكامل لسوق العمل الحر 🚀</h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">لقد حققت جاهزية مهنية أعلى من 80% وأكملت أكثر من 70% من مسار التعلم.</p>
              </div>
            </div>
            <Link
              to="/marketplace"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-105 transition"
            >
              التقديم على مشاريع الآن
            </Link>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">طوّر ملفك للوصول إلى جاهزية 80% لفتح ميزة التقديم المباشر على مشاريع العملاء</p>
                <p className="text-xs text-slate-400 mt-0.5">ارفع سيرتك الذاتية في صفحة تحليل الـ CV أو أكمل الكورسات لرفع مؤشر الجاهزية.</p>
              </div>
            </div>
            <Link
              to="/cv-analysis"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition shrink-0"
            >
              تحليل الـ CV الآن
            </Link>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">مؤشر الجاهزية</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono">{readiness}%</p>
            <p className="text-[11px] text-slate-500">معدل تقييم المهارات</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">المشاريع في المعرض</span>
              <FolderKanban className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{projects.length}</p>
            <p className="text-[11px] text-slate-500">مشروع منشور وموثق</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">المهارات المكتشفة</span>
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{userSkills.length}</p>
            <p className="text-[11px] text-slate-500">مهارة تقنية مثبتة</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">إنجاز مسار التعلم</span>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{progress}%</p>
            <p className="text-[11px] text-slate-500">من إجمالي الوحدات</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-[#13161e] p-1.5 rounded-2xl border border-slate-800 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            نظرة عامة والمهارات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'portfolio'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            معرض الأعمال ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add-project')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'add-project'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + إضافة مشروع
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Left 2 Cols: Career Readiness & Skills */}
            <div className="lg:col-span-2 space-y-6">
              {/* Readiness Score Box */}
              <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>مقياس الجاهزية المهنية (Career Readiness Score)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {readiness}% جاهزية
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  يتم حساب مؤشر الجاهزية استناداً إلى نتائج تحليل سيرتك الذاتية بالذكاء الاصطناعي، الكورسات المكتملة، وتقييم جودة المشاريع العملية المنفذة.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full bg-[#1e2330] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(Math.max(readiness, 5), 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>مبتدئ (0%)</span>
                    <span>جاهز للعمل الحر (80%)</span>
                    <span>محترف (100%)</span>
                  </div>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>المهارات المعتمدة في ملفك الشخصي</span>
                  </h3>
                  <Link to="/skill-verification" className="text-xs text-emerald-400 hover:underline">
                    + توثيق مهارة جديدة
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {userSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1e2330] border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Market Trends AI */}
            <div className="space-y-6">
              <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>توقعات اتجاهات السوق (AI)</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Pulse</span>
                </div>
                <p className="text-xs text-slate-400">المهارات الأكثر طلباً والأعلى أجراً في سوق العمل الحر بالشرق الأوسط حالياً:</p>
                <div className="space-y-2.5">
                  {trendsLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-10 bg-slate-800/60 rounded-xl" />
                      <div className="h-10 bg-slate-800/60 rounded-xl" />
                      <div className="h-10 bg-slate-800/60 rounded-xl" />
                    </div>
                  ) : (
                    (marketTrends.length > 0 ? marketTrends : [
                      { skill: 'React & Next.js', demand: 'مرتفع جداً (+34%)', badge: 'High' },
                      { skill: 'Node.js & Express API', demand: 'مرتفع (+28%)', badge: 'High' },
                      { skill: 'Python AI & ML', demand: 'صاعد بقوة (+45%)', badge: 'Trending' },
                      { skill: 'TailwindCSS & UI/UX', demand: 'مستمر (+20%)', badge: 'Stable' },
                    ]).map((item, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-[#0B0F17] border border-slate-800/80 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-200">{item.skill || item.title}</span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">{item.demand || 'مطلوب بقوة'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Portfolio Projects */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">معرض أعمالك ومشاريعك السابقة</h2>
                <p className="text-xs text-slate-400">المشاريع التي تظهر لأصحاب العمل عند تقديمك على الفرص الحرة</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('add-project')}
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مشروع جديد</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-[#13161e] border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">لم تقم بإضافة أي مشاريع في معرض أعمالك بعد</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">إضافة 2-3 مشاريع عملية ترفع فرص قبولك من قبل العملاء بنسبة 85%.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('add-project')}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة أول مشروع الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#13161e] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition duration-300 flex flex-col justify-between group"
                  >
                    {proj.image && (
                      <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.techStack || []).map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-[#1e2330] text-[11px] font-mono text-slate-300 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          {proj.link ? (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-semibold"
                            >
                              <span>معاينة المشروع</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-slate-500">بدون رابط خارجي</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                            title="حذف المشروع"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Add Project Form */}
        {activeTab === 'add-project' && (
          <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>إضافة مشروع جديد لمعرض أعمالك</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                املأ تفاصيل المشروع لإبراز مهاراتك التقنية للعملاء
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  عنوان المشروع <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectFormChange}
                  placeholder="مثال: متجر إلكتروني متكامل بـ React و Node.js"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                />
                {formErrors.title && <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  وصف المشروع ودورك فيه <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={projectForm.description}
                  onChange={handleProjectFormChange}
                  placeholder="اشرح الهدف من المشروع، المشكلة التي يحلها، ودورك في التنفيذ..."
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                />
                {formErrors.description && <p className="text-xs text-red-400 mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  التقنيات المستخدمة (مفصولة بفواصل) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={projectForm.techStack}
                  onChange={handleProjectFormChange}
                  placeholder="React, TypeScript, TailwindCSS, Express, MongoDB"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                />
                {formErrors.techStack && <p className="text-xs text-red-400 mt-1">{formErrors.techStack}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  رابط المشروع (GitHub أو Live Demo)
                </label>
                <input
                  type="url"
                  name="link"
                  value={projectForm.link}
                  onChange={handleProjectFormChange}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  رابط صورة المعاينة (اختياري)
                </label>
                <input
                  type="url"
                  name="image"
                  value={projectForm.image}
                  onChange={handleProjectFormChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black py-3 rounded-xl text-xs hover:brightness-105 transition"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ ونشر المشروع'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
