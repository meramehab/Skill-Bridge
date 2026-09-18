/**
 * @file adminService.js
 * @description Service for Admin dashboard statistics, activities, and dispute resolution.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { simulateNetworkDelay } from "../utils/asyncUtils";

const MOCK_ADMIN_STATS = [
  { icon: "Users", iconClass: "text-2xl text-primary", value: "1,250", label: "مستخدمين", change: "+450 نشط", changeColor: "text-green-600" },
  { icon: "FolderKanban", iconClass: "text-2xl text-blue-500", value: "320", label: "مشاريع", change: "85 نشطة", changeColor: "text-blue-600" },
  { icon: "ChartBar", iconClass: "text-2xl text-green-500", value: "$42,500", label: "إيرادات", change: "+12% هذا الشهر", changeColor: "text-green-600" },
  { icon: "AlertTriangle", iconClass: "text-2xl text-yellow-500", value: "12", label: "نزاعات", change: "بانتظار التحكيم", changeColor: "text-yellow-600" }
];

const MOCK_RECENT_ACTIVITIES = [
  { id: 1, user: "أحمد محمد", action: "سجل جديد", time: "منذ 5 دقائق" },
  { id: 2, user: "سارة علي", action: "أنشأت مشروع جديد", time: "منذ 15 دقيقة" },
  { id: 3, user: "محمد خالد", action: "طلب توثيق حساب", time: "منذ ساعة" },
  { id: 4, user: "نورة أحمد", action: "نزاع على مشروع #123", time: "منذ ساعتين" }
];

const MOCK_DISPUTES = [
  { id: 1, title: "نزاع المشروع #1001", between: "بين أحمد وسارة" },
  { id: 2, title: "نزاع المشروع #1002", between: "بين محمد ونورة" },
  { id: 3, title: "نزاع المشروع #1003", between: "بين خالد وفاطمة" }
];

export async function getAdminDashboardData() {
  if (USE_MOCK?.home ?? true) {
    await simulateNetworkDelay(400);
    return {
      stats: MOCK_ADMIN_STATS,
      recentActivities: MOCK_RECENT_ACTIVITIES,
      disputes: MOCK_DISPUTES
    };
  }

  const { data } = await apiClient.get("/admin/dashboard");
  return data;
}

export async function resolveDispute(disputeId) {
  if (USE_MOCK?.home ?? true) {
    await simulateNetworkDelay(300);
    return { success: true, message: `تم التحكيم في النزاع #${disputeId} بنجاح` };
  }

  const { data } = await apiClient.post(`/admin/disputes/${disputeId}/resolve`);
  return data;
}
