/**
 * @file StudentDashboardLogicView.jsx
 * @description Logic wiring for Student Dashboard with career readiness gauge, verified skills, reputation stats, and active projects progress.
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
  Sparkles
} from "lucide-react";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";

export function StudentDashboardLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Skeleton = () => <div>Loading...</div>
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton />
      </div>
    );
  }

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case "FolderKanban":
        return <FolderKanban className="w-6 h-6 text-indigo-600" />;
      case "CheckCircle":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case "Star":
        return <Star className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case "Clock":
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <FolderKanban className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div id="student-dashboard-container" className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            مرحباً، {user?.name || "أحمد"} 👋
          </h1>
          <p className="text-gray-600 mt-1">إليك ملخص نشاطك الأكاديمي والمهني على المنصة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/learning"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            أكمل التعلم
          </a>
          <a
            href="/marketplace"
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            ابحث عن فرص
          </a>
        </div>
      </div>

      {/* Career Readiness Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="min-w-[140px]">
            <h3 className="text-sm font-medium text-indigo-100 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              مؤشر الجاهزية للعمل الحر
            </h3>
            <p className="text-5xl font-extrabold">{readinessScore}%</p>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="w-full bg-white/20 rounded-full h-3.5 overflow-hidden backdrop-blur-sm">
              <div
                className="bg-white h-3.5 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${readinessScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-indigo-100 mt-2 font-medium">
              <span>مبتدئ</span>
              <span>متوسط</span>
              <span>متقدم</span>
              <span>جاهز للعمل الحر 🚀</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center min-w-[130px]">
            <p className="text-2xl font-bold">{verifiedSkills}</p>
            <p className="text-xs text-indigo-100 font-medium">مهارات موثّقة ✅</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.label || idx}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-gray-50">
                {getStatIcon(stat.iconName)}
              </div>
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Active Projects Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            مشاريعي النشطة
          </h2>
          <a
            href="/marketplace"
            className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 flex items-center gap-1 transition"
          >
            <span>عرض كل الفرص</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-base font-medium mb-3">لا توجد مشاريع نشطة حالياً</p>
            <a
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
            >
              <Briefcase className="w-4 h-4" />
              تصفح فرص ومشاريع العمل الحر
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.map((project) => (
              <div key={project.id} className="py-4.5 first:pt-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{project.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">العميل: {project.client}</p>
                  </div>
                  <span className="text-sm text-indigo-600 font-extrabold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboardLogicView;
