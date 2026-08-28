/**
 * @file profileMock.js
 * @description Mock data and handlers for Student Profile, Career Readiness, Portfolio & Reputation.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";
import { MOCK_CURRENT_USER } from "./authMock";

export const MOCK_PROFILE_DATABASE = {
  std_10293: {
    ...MOCK_CURRENT_USER,
    scoreBreakdown: {
      cvQuality: 90,
      skillsAssessment: 85,
      completedGigs: 80,
      communityEngagement: 75
    },
    portfolio: [
      {
        id: "port_1",
        title: "منصة تعليمية مصغرة لطلاب الهندسة",
        description: "تطبيق ويب تفاعلي لإدارة الجداول والمحاضرات مع دعم Offline Mode.",
        projectUrl: "https://github.com/ahmed/eng-edu-hub",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        tags: ["React", "IndexedDB", "Tailwind CSS"],
        isVisible: true
      },
      {
        id: "port_2",
        title: "لوحة تحكم إحصائية للطقس وحركة المرور في القاهرة",
        description: "عرض خرائط تفاعلية ومؤشرات جودة الهواء وسرعة المرور.",
        projectUrl: "https://cairo-traffic-dash.vercel.app",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        tags: ["Next.js", "Chart.js", "Leaflet"],
        isVisible: true
      }
    ],
    reputationMetrics: {
      onTimeDeliveryRate: "98%",
      clientSatisfaction: 4.9,
      totalEarnedPoints: 1250,
      badges: [
        { id: "b1", name: "طالب موثق", icon: "verified_student", tier: "Gold" },
        { id: "b2", name: "خبير React", icon: "react_pro", tier: "Silver" },
        { id: "b3", name: "منجز المهام السريعة", icon: "speed_demon", tier: "Bronze" }
      ]
    }
  }
};

export async function mockGetProfile(userId) {
  await simulateNetworkDelay(400);
  const targetId = userId || MOCK_CURRENT_USER.id;
  const profile = MOCK_PROFILE_DATABASE[targetId] || {
    ...MOCK_CURRENT_USER,
    id: targetId,
    name: "طالب مسجل",
    bio: "طالب بجامعة القاهرة",
    scoreBreakdown: { cvQuality: 70, skillsAssessment: 70, completedGigs: 60, communityEngagement: 60 },
    portfolio: [],
    reputationMetrics: { onTimeDeliveryRate: "100%", clientSatisfaction: 5.0, badges: [] }
  };
  return profile;
}

export async function mockUpdateProfile(userId, updateData) {
  await simulateNetworkDelay(500);
  const targetId = userId || MOCK_CURRENT_USER.id;
  if (!MOCK_PROFILE_DATABASE[targetId]) {
    MOCK_PROFILE_DATABASE[targetId] = { ...MOCK_CURRENT_USER, id: targetId };
  }
  MOCK_PROFILE_DATABASE[targetId] = {
    ...MOCK_PROFILE_DATABASE[targetId],
    ...updateData
  };
  return {
    success: true,
    user: MOCK_PROFILE_DATABASE[targetId],
    message: "تم تحديث الملف الشخصي بنجاح."
  };
}

export async function mockUploadAvatar(userId, file) {
  await simulateNetworkDelay(800);
  const newAvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&t=" + Date.now();
  return {
    success: true,
    avatarUrl: newAvatarUrl
  };
}
