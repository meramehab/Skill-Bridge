/**
 * @file AdminDashboardLogicView.jsx
 * @description Figma-aligned presentation layer for Admin Dashboard.
 * Platform monitoring, recent activities stream, dispute arbitration, and administrative navigation.
 * Strict zero-logic-modification: preserves all hooks, handlers, state contracts, and data fields.
 */
import React from "react";
import {
  Users,
  FolderKanban,
  GraduationCap,
  BarChart3,
  AlertTriangle,
  Clock,
  FileDown,
  UserPlus,
  Shield,
  Activity,
  Gavel,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

export function AdminDashboardLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Skeleton = () => (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-12 bg-slate-800/60 rounded-2xl w-1/3"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-850 rounded-2xl border border-slate-800"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-slate-850 rounded-3xl border border-slate-800"></div>
        <div className="h-80 bg-slate-850 rounded-3xl border border-slate-800"></div>
      </div>
    </div>
  )
}) {
  const {
    stats,
    recentActivities,
    disputes,
    isLoading,
    isError,
    error,
    isResolving,
    refetch,
    resolveDispute,
    exportReport
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div id="admin-dashboard-loading" className="min-h-screen bg-[#0B0F17] py-8">
        <Skeleton />
      </div>
    );
  }

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case "Users":
        return <Users className="w-5 h-5 text-indigo-400" />;
      case "FolderKanban":
        return <FolderKanban className="w-5 h-5 text-blue-400" />;
      case "ChartBar":
        return <BarChart3 className="w-5 h-5 text-emerald-400" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-[#0B0F17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-2 border-b border-slate-800/60">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>إدارة المنصة الموحدة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              لوحة تحكم <span className="bg-gradient-to-l from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">الإدارة المركزية</span>
            </h1>
            <p className="text-sm text-slate-400">مراقبة مؤشرات الأداء الحية، تدقيق العمليات، وفض النزاعات بين الأطراف</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-export-report"
              onClick={exportReport}
              className="inline-flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:border-slate-600 active:scale-95 shadow-md"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span>تصدير تقرير شامل</span>
            </button>
            <button
              id="btn-add-admin"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/admin/users?action=new-admin";
                }
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>إضافة مسؤول جديد</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between text-rose-300">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{error || "تعذر جلب بيانات لوحة التحكم الحديثة."}</span>
            </div>
            <button
              onClick={refetch}
              className="text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label || idx}
              className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-indigo-500/30 p-5 rounded-2xl shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-indigo-500/10 border border-slate-700/50 group-hover:border-indigo-500/20 transition">
                  {getStatIcon(stat.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
              {stat.change && (
                <p className={`text-xs mt-1.5 font-semibold ${stat.changeColor || "text-emerald-400"}`}>
                  {stat.change}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity & Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity Stream */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">النشاطات والأحداث الأخيرة</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">مباشر 🟢</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="py-3.5 flex justify-between items-center hover:bg-slate-800/20 px-2 rounded-xl transition">
                  <div>
                    <p className="font-semibold text-white text-sm">{activity.user}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.action}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/40">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Disputes */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Gavel className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">النزاعات والشكاوى النشطة</h2>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {disputes.length} قضايا
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {disputes.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CheckCircle className="w-10 h-10 text-emerald-400/60 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">لا توجد أي نزاعات أو خلافات نشطة حالياً</p>
                  <p className="text-xs text-slate-500 mt-1">جميع المعاملات والمشاريع تسير بشكل آمن وسلس ✨</p>
                </div>
              ) : (
                disputes.map((dispute) => (
                  <div key={dispute.id} className="py-3.5 flex justify-between items-center hover:bg-slate-800/20 px-2 rounded-xl transition">
                    <div>
                      <p className="font-semibold text-white text-sm">{dispute.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{dispute.between}</p>
                    </div>
                    <button
                      onClick={() => resolveDispute(dispute.id)}
                      disabled={isResolving}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition active:scale-95 disabled:opacity-50 flex items-center gap-1"
                    >
                      {isResolving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Gavel className="w-3 h-3" />}
                      <span>تحكيم</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl shadow-lg transition-all duration-200 text-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition">إدارة المستخدمين</p>
            <p className="text-xs text-slate-400 mt-0.5">الطلاب، أصحاب العمل، الأكاديميين</p>
          </a>

          <a
            href="/admin/projects"
            className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl shadow-lg transition-all duration-200 text-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition">
              <FolderKanban className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-blue-300 transition">إدارة المشاريع</p>
            <p className="text-xs text-slate-400 mt-0.5">مراجعة الفرص، العقود والضمانات</p>
          </a>

          <a
            href="/admin/universities"
            className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl shadow-lg transition-all duration-200 text-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition">إدارة الجامعات</p>
            <p className="text-xs text-slate-400 mt-0.5">البرامج الأكاديمية والتوثيق</p>
          </a>

          <a
            href="/admin/analytics"
            className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 p-5 rounded-2xl shadow-lg transition-all duration-200 text-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-purple-300 transition">التقارير والإحصائيات</p>
            <p className="text-xs text-slate-400 mt-0.5">معدلات التوظيف ونمو المنصة</p>
          </a>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardLogicView;
