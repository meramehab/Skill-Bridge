/**
 * @file AdminDashboardLogicView.jsx
 * @description Logic wiring for Admin Dashboard monitoring platform statistics, recent activities, disputes, and administrative actions.
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
  UserPlus
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

export function AdminDashboardLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Skeleton = () => <div>Loading...</div>
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton />
      </div>
    );
  }

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case "Users":
        return <Users className="w-6 h-6 text-indigo-600" />;
      case "FolderKanban":
        return <FolderKanban className="w-6 h-6 text-blue-500" />;
      case "ChartBar":
        return <BarChart3 className="w-6 h-6 text-emerald-500" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div id="admin-dashboard-container" className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
          <p className="text-gray-600 mt-1">مراقبة وإدارة جميع جوانب المنصة ومؤشرات الأداء</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            id="btn-export-report"
            onClick={exportReport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            تصدير تقرير
          </button>
          <button
            id="btn-add-admin"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/admin/users?action=new-admin";
              }
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            إضافة مسؤول
          </button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex justify-between items-center">
          <span>{error || "تعذر جلب بيانات لوحة التحكم الحديثة."}</span>
          <button onClick={refetch} className="underline text-sm font-semibold">إعادة المحاولة</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.label || idx}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-gray-50">
                {getStatIcon(stat.icon)}
              </div>
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className={`text-xs mt-1 font-medium ${stat.changeColor || "text-gray-500"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            النشاطات الأخيرة
          </h2>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="py-3.5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{activity.user}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-amber-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            النزاعات النشطة
          </h2>
          <div className="divide-y divide-gray-100">
            {disputes.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">لا توجد نزاعات نشطة حالياً ✨</p>
            ) : (
              disputes.map((dispute) => (
                <div key={dispute.id} className="py-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{dispute.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{dispute.between}</p>
                  </div>
                  <button
                    onClick={() => resolveDispute(dispute.id)}
                    disabled={isResolving}
                    className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition"
                  >
                    تحكيم
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/admin/users"
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">إدارة المستخدمين</p>
        </a>

        <a
          href="/admin/projects"
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
            <FolderKanban className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">إدارة المشاريع</p>
        </a>

        <a
          href="/admin/universities"
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">إدارة الجامعات</p>
        </a>

        <a
          href="/admin/analytics"
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">الإحصائيات</p>
        </a>
      </div>
    </div>
  );
}

export default AdminDashboardLogicView;
