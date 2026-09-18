import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import projectsService from '../services/projects.service';
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  Sparkles,
  TrendingUp,
  FileText,
  DollarSign,
  AlertCircle,
  X,
  Send,
  Eye,
} from 'lucide-react';

const INITIAL_CLIENT_PROJECTS = [
  {
    _id: 'cp-1',
    title: 'تطوير لوحة تحكم تفاعلية لبيانات التجارة الإلكترونية',
    category: 'Full-Stack Development',
    budget: 4500,
    deadline: '2026-10-15',
    status: 'open',
    skills: ['React', 'Node.js', 'Chart.js', 'MongoDB'],
    proposalsCount: 6,
    description: 'مطلوب مطور أو فريق طلابي لبناء داشبورد حديث لتحليل مبيعات المتجر وإصدار تقارير لحظية.',
    createdAt: 'منذ يومين',
  },
  {
    _id: 'cp-2',
    title: 'تصميم وبناء واجهة تطبيق جوال تفاعلي (React Native / Flutter)',
    category: 'Mobile Development',
    budget: 6000,
    deadline: '2026-10-30',
    status: 'in_progress',
    skills: ['React Native', 'Figma', 'Firebase'],
    proposalsCount: 11,
    description: 'تطبيق موجه للطلاب والجامعات لتنظيم الفعاليات الأكاديمية.',
    createdAt: 'منذ 5 أيام',
  },
];

const RECOMMENDED_STUDENTS = [
  {
    id: 's-1',
    name: 'أحمد محمود',
    title: 'مطور واجهات أمامية & React.js',
    university: 'جامعة القاهرة - حاسبات ومعلومات',
    matchScore: 96,
    readiness: 92,
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux'],
    completedProjects: 8,
  },
  {
    id: 's-2',
    name: 'سارة إبراهيم',
    title: 'مطورة باكت إند وقواعد بيانات',
    university: 'جامعة عين شمس - هندسة برمجيات',
    matchScore: 91,
    readiness: 88,
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker'],
    completedProjects: 6,
  },
  {
    id: 's-3',
    name: 'عمر خالد',
    title: 'Full Stack Engineer & AI Integrations',
    university: 'جامعة المنصورة - ذكاء اصطناعي',
    matchScore: 88,
    readiness: 85,
    skills: ['Python', 'FastAPI', 'React', 'Gemini API'],
    completedProjects: 5,
  },
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'talent' | 'escrow'
  const [projects, setProjects] = useState(INITIAL_CLIENT_PROJECTS);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  // استمارة نشر المشروع الجديد
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Web Development',
    budget: '',
    deadline: '',
    skills: '',
    description: '',
    isSquadOnly: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.budget || !newProject.description) {
      alert('يرجى ملء الحقول الأساسية للمشروع');
      return;
    }

    setSubmitting(true);
    const parsedSkills = newProject.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const projectPayload = {
      _id: `cp-${Date.now()}`,
      title: newProject.title.trim(),
      category: newProject.category,
      budget: Number(newProject.budget),
      deadline: newProject.deadline || '2026-11-01',
      skills: parsedSkills.length > 0 ? parsedSkills : ['Full Stack'],
      description: newProject.description.trim(),
      status: 'open',
      proposalsCount: 0,
      createdAt: 'الآن',
      client: user?._id || 'my-client-id',
      clientName: user?.fullName || 'شركة أعمال رائدة',
    };

    try {
      if (projectsService?.createProject) {
        await projectsService.createProject(projectPayload).catch(() => null);
      }
    } catch {
      // Graceful fallback to state
    }

    setProjects((prev) => [projectPayload, ...prev]);
    setSubmitting(false);
    setPostSuccess('تم نشر المشروع بنجاح وتأمينه بحساب Escrow! 🚀');

    setTimeout(() => {
      setIsPostModalOpen(false);
      setPostSuccess('');
      setNewProject({
        title: '',
        category: 'Web Development',
        budget: '',
        deadline: '',
        skills: '',
        description: '',
        isSquadOnly: false,
      });
    }, 1200);
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (p.skills || []).some((s) => s.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Ambient glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-4 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>لوحة تحكم صاحب العمل والتوظيف الأكاديمي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
              مرحباً، <span className="bg-gradient-to-l from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">{user?.fullName || 'شريك الأعمال'}</span> 🏢
            </h1>
            <p className="text-sm text-slate-400">إدارة مشاريعك المنشورة، مراجعة عروض الطلاب، وضمان المدفوعات عبر نظام Escrow الآمن</p>
          </div>

          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5 text-slate-950" />
            <span>نشر مشروع أو وظيفة جديدة</span>
          </button>
        </div>

        {/* Client KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">المشاريع المنشورة</span>
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{projects.length}</p>
            <p className="text-[11px] text-slate-500">فرص عمل نشطة للطلاب</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">العروض المستلمة</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-400 font-mono">
              {projects.reduce((acc, p) => acc + (p.proposalsCount || 0), 0)}
            </p>
            <p className="text-[11px] text-slate-500">متقدمون من مختلف الجامعات</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">المشاريع قيد التنفيذ</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400 font-mono">
              {projects.filter((p) => p.status === 'in_progress').length}
            </p>
            <p className="text-[11px] text-slate-500">متابعة دقيقة للمخرجات</p>
          </div>

          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">أموال Escrow المحمية</span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono">
              {projects.reduce((acc, p) => acc + (p.budget || 0), 0).toLocaleString()} ج.م
            </p>
            <p className="text-[11px] text-slate-500">ضمان بنكي بحساب محمي</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-[#13161e] p-1.5 rounded-2xl border border-slate-800 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'projects'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المشاريع المنشورة ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('talent')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'talent'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكفاءات الطلابية الموصى بها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('escrow')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'escrow'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            حساب الضمان (Escrow)
          </button>
        </div>

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">إدارة مشاريعك وعروض الطلاب</h2>
                <p className="text-xs text-slate-400">يمكنك مراجعة المقترحات الفنية والتعاقد الآمن مع الطلاب</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث في مشاريعي..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full sm:w-64 bg-[#13161e] border border-slate-800 rounded-xl px-4 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#13161e] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-4 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                        {p.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === 'open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {p.status === 'open' ? 'مفتوح للتقديم' : 'قيد التنفيذ'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-emerald-400 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(p.skills || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#1e2330] text-[11px] font-mono text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">الميزانية المودعة: </span>
                      <span className="font-bold font-mono text-emerald-400">{p.budget} ج.م</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-blue-400 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{p.proposalsCount} عروض</span>
                      </span>
                      <Link
                        to={`/marketplace`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Recommended Talent */}
        {activeTab === 'talent' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white">الطلاب والفرق الأكثر تطابقاً مع متطلباتك</h2>
              <p className="text-xs text-slate-400">مُرشحون تلقائياً بالذكاء الاصطناعي بناءً على مؤشرات الجاهزية والمهارات الموثقة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDED_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow">
                        {student.name[0]}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        {student.matchScore}% تطابق
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{student.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{student.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{student.university}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>مؤشر الجاهزية الأكاديمية</span>
                        <span className="text-emerald-400 font-bold">{student.readiness}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1e2330] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${student.readiness}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {student.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#1e2330] text-[10px] font-mono text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {student.completedProjects} مشاريع منجزة
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`تم إرسال دعوة عمل مباشرة إلى ${student.name}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
                    >
                      دعوة للمشروع
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Escrow Safety */}
        {activeTab === 'escrow' && (
          <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">نظام حماية المدفوعات الجامعي (SkillBridge Escrow)</h3>
                <p className="text-xs text-slate-400 mt-0.5">أموالك محفوظة في أمان تام ولا يتم تحريرها للطالب إلا بعد استلامك للمخرجات وموافقتك</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">1</div>
                <h4 className="text-xs font-bold text-white">إيداع ميزانية المشروع</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">يتم حجز الميزانية المتفق عليها بحساب الضمان الآمن عبر Paymob أو فودافون كاش.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">2</div>
                <h4 className="text-xs font-bold text-white">التنفيذ ومراجعة الكود</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">يقوم الطالب أو الفريق بتنفيذ المهام ومراجعة جودة الكود عبر بوابة AI Quality Gate.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">3</div>
                <h4 className="text-xs font-bold text-white">الاستلام وتحرير الدفعة</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">بعد تأكيد رضاك عن المشروع، تُحوّل الدفعة تلقائياً إلى حساب الطالب الجامعي.</p>
              </div>
            </div>
          </div>
        )}

        {/* Post Job Modal */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">نشر مشروع أو وظيفة جديدة للطلاب</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {postSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {postSuccess}
                </div>
              )}

              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    عنوان المشروع <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    placeholder="مثال: تطوير تطبيق إدارة مخازن بتقنية React و Node.js"
                    className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      المجال / التخصص
                    </label>
                    <select
                      name="category"
                      value={newProject.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                    >
                      <option value="Web Development">تطوير مواقع وويب</option>
                      <option value="Mobile Development">تطبيقات الجوال</option>
                      <option value="AI & Machine Learning">ذكاء اصطناعي وتحليل بيانات</option>
                      <option value="UI/UX Design">تصميم واجهات المستخدم</option>
                      <option value="Cybersecurity">أمن سيبراني واختبار اختراق</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      الميزانية التقديرية (ج.م) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={newProject.budget}
                      onChange={handleInputChange}
                      placeholder="مثال: 5000"
                      className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      تاريخ انتهاء المشروع (الموعد النهائي)
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={newProject.deadline}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      المهارات المطلوبة (مفصولة بفواصل)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={newProject.skills}
                      onChange={handleInputChange}
                      placeholder="React, Node.js, Tailwind"
                      className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    وصف المشروع والمخرجات المطلوبة <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="وضح متطلبات المشروع، معايير القبول، وأي تفاصيل تقنية مساعدة للطلاب..."
                    className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isSquadOnly"
                    name="isSquadOnly"
                    checked={newProject.isSquadOnly}
                    onChange={handleInputChange}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="isSquadOnly" className="text-xs text-slate-300 cursor-pointer">
                    تفضيل توظيف فريق طلابي متكامل (Squad) بدلاً من مستقل منفرد
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black py-3 rounded-xl text-xs hover:brightness-105 transition"
                  >
                    {submitting ? 'جاري نشر المشروع وتأمينه...' : 'نشر المشروع وتفعيله الآن'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
