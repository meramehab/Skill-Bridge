/**
 * @file StudentDashboardLogicView.jsx
 * @description Figma-aligned presentation layer for Student Dashboard.
 * Career readiness gauge, verified skills, reputation stats, and active projects progress.
 * Strict zero-logic-modification: preserves all hooks, handlers, state contracts, and data fields.
 */
import React from "react";
import {
  FolderKanban,
  CheckCircle2,
  Star,
  Clock,
  BookOpen,
  Briefcase,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  ChevronLeft,
  Zap
} from "lucide-react";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";

export function StudentDashboardLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Skeleton = () => (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-12 bg-slate-800/60 rounded-2xl w-1/3"></div>
      <div className="h-44 bg-slate-850 rounded-3xl border border-slate-800"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-850 rounded-2xl border border-slate-800"></div>
        ))}
      </div>
      <div className="h-64 bg-slate-850 rounded-2xl border border-slate-800"></div>
    </div>
  )
}) {
  const {
    user,
    projects,
    stats,
    readinessScore,
    verifiedSkills,
    isLoading,
    isError,
    error,
    refetch
  } = useStudentDashboard();

  if (isLoading) {
    return (
      <div id="student-dashboard-loading" className="min-h-screen bg-[#0B0F17] py-8">
        <Skeleton />
      </div>
    );
  }

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case "FolderKanban":
        return <FolderKanban className="w-5 h-5 text-emerald-400" />;
      case "CheckCircle":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "Star":
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <FolderKanban className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div id="student-dashboard-container" className="min-h-screen bg-[#0B0F17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-2 border-b border-slate-800/60">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>لوحة تحكم الطالب المهنية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              مرحباً، <span className="bg-gradient-to-l from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{user?.name || "أحمد"}</span> 👋
            </h1>
            <p className="text-sm text-slate-400">إليك ملخص مؤشرات جاهزيتك ونشاطك المهني والأكاديمي على المنصة</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              id="btn-nav-learning"
              href="/learning"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>أكمل مسار التعلم</span>
            </a>
            <a
              id="btn-nav-marketplace"
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:border-slate-600 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>ابحث عن مشاريع</span>
            </a>
          </div>
        </div>

        {/* Error Alert if any */}
        {isError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between text-rose-300">
            <span className="text-sm font-medium">{error || "حدث خطأ أثناء تحميل بيانات لوحة التحكم."}</span>
            <button
              onClick={refetch}
              className="text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg transition"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Career Readiness Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#131B2A] to-slate-900 border border-emerald-500/25 p-6 sm:p-8 shadow-2xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Score Display */}
            <div className="flex items-center gap-5 min-w-[200px]">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-5 h-5 mb-0.5 text-amber-300" />
                <span className="text-2xl font-black leading-none">{readinessScore}%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  مؤشر الجاهزية للعمل
                </h3>
                <p className="text-xl font-extrabold text-white">
                  {readinessScore >= 70 ? "مؤهل لسوق العمل 🚀" : "قيد التطوير والتأهيل"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {readinessScore >= 70 ? "تم فتح سوق المشاريع الحقيقية لك" : "أكمل المهام لفتح سوق العمل الحر"}
                </p>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="flex-1 w-full max-w-xl">
              <div className="w-full bg-slate-800/80 rounded-full h-3.5 overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(Math.max(readinessScore, 5), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span className={readinessScore < 40 ? "text-emerald-400 font-bold" : ""}>مبتدئ (0%)</span>
                <span className={readinessScore >= 40 && readinessScore < 70 ? "text-emerald-400 font-bold" : ""}>متوسط (40%)</span>
                <span className={readinessScore >= 70 && readinessScore < 90 ? "text-emerald-400 font-bold" : ""}>متقدم (70%)</span>
                <span className={readinessScore >= 90 ? "text-emerald-400 font-bold" : ""}>جاهز للعمل الحر 🚀 (100%)</span>
              </div>
            </div>

            {/* Verified Skills Pill */}
            <div className="bg-slate-800/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/80 text-center min-w-[150px] shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-2xl font-black text-white">{verifiedSkills}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">مهارات موثّقة ✅</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label || idx}
              className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/30 p-5 rounded-2xl shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 border border-slate-700/50 group-hover:border-emerald-500/20 transition">
                  {getStatIcon(stat.iconName)}
                </div>
                <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Active Projects Section */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">مشاريعي النشطة</h2>
                <p className="text-xs text-slate-400">متابعة سير العمل في المشاريع المسندة إليك</p>
              </div>
            </div>
            <a
              id="btn-view-all-projects"
              href="/marketplace"
              className="text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition group"
            >
              <span>تصفح كل الفرص</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">لا توجد مشاريع نشطة حالياً</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                قدم عروضك على المشاريع المتاحة في السوق للبدء في اكتساب الخبرة وبناء ملفك المهني
              </p>
              <a
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <Briefcase className="w-4 h-4" />
                <span>تصفح فرص العمل الحر</span>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-850/60 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{project.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">العميل: <span className="text-slate-300 font-medium">{project.client}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">نسبة الإنجاز:</span>
                      <span className="text-sm font-black text-emerald-400">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboardLogicView;
