/**
 * @file projectsMock.js
 * @description Mock data and handlers for Marketplace, Project Details, and AI Proposal Assistant.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_PROJECTS_DATABASE = [
  {
    id: "proj_101",
    title: "بناء واجهة متجر إلكتروني متكاملة بـ Next.js و Tailwind",
    description: "مطلوب طالب متميز لبناء واجهة متجر لبيع الكتب والمستلزمات الجامعية، مع ربطها ببوابة دفع وتوفير تجربة مستخدم سريعة وسلسة.",
    budget: 6500,
    requiredSkills: ["React.js", "Next.js", "Tailwind CSS", "REST APIs"],
    type: "project",
    status: "open",
    clientName: "دار المعرفة للنشر",
    clientRating: 4.9,
    proposalsCount: 4,
    createdAt: "2026-08-20T10:00:00Z",
    deadline: "2026-09-15",
    matchPercentage: 92
  },
  {
    id: "proj_102",
    title: "إصلاح أخطاء في واجهة React وتعديل استجابة الموبايل",
    description: "مشروع مصغر (Micro Gig) لفحص كود مشروع تخرج وتصحيح 4 أخطاء في الـ CSS واستجابة الشاشات الصغيرة.",
    budget: 1200,
    requiredSkills: ["React.js", "CSS", "Responsive Design"],
    type: "micro_gig",
    status: "open",
    clientName: "فريق تخرج هندسة حلوان",
    clientRating: 4.5,
    proposalsCount: 8,
    createdAt: "2026-08-22T14:30:00Z",
    deadline: "2026-08-30",
    matchPercentage: 85
  },
  {
    id: "proj_103",
    title: "تطوير لوحة متابعة مهام للفرق الطلابية مع Dark Mode",
    description: "نبحث عن مطور واجهات لبناء لوحة متابعة للمهام تشمل السحب والإفلات وإحصائيات تفاعلية بالـ Chart.js.",
    budget: 4800,
    requiredSkills: ["JavaScript (ES6+)", "React.js", "Chart.js"],
    type: "project",
    status: "open",
    clientName: "اتحاد طلاب جامعة القاهرة",
    clientRating: 5.0,
    proposalsCount: 2,
    createdAt: "2026-08-25T09:15:00Z",
    deadline: "2026-09-20",
    matchPercentage: 78
  },
  {
    id: "proj_104",
    title: "تكامل مع Firebase لتفعيل الإشعارات الفورية",
    description: "مطلوب مطور لديه خبرة في ربط تطبيق ويب بـ Firebase Cloud Messaging وإعداد Service Worker.",
    budget: 2500,
    requiredSkills: ["Firebase", "JavaScript (ES6+)", "Service Workers"],
    type: "micro_gig",
    status: "open",
    clientName: "ستارت اب تيك جو",
    clientRating: 4.8,
    proposalsCount: 5,
    createdAt: "2026-08-26T12:00:00Z",
    deadline: "2026-09-05",
    matchPercentage: 60
  }
];

export async function mockGetProjects(filters = {}) {
  await simulateNetworkDelay(500);

  let results = [...MOCK_PROJECTS_DATABASE];

  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.requiredSkills.some((s) => s.toLowerCase().includes(query))
    );
  }

  if (filters.skill) {
    results = results.filter((p) =>
      p.requiredSkills.some((s) => s.toLowerCase() === filters.skill.toLowerCase())
    );
  }

  if (filters.type && filters.type !== "all") {
    results = results.filter((p) => p.type === filters.type);
  }

  if (filters.minBudget) {
    results = results.filter((p) => p.budget >= Number(filters.minBudget));
  }

  if (filters.maxBudget) {
    results = results.filter((p) => p.budget <= Number(filters.maxBudget));
  }

  if (filters.sortBy === "highest_budget") {
    results.sort((a, b) => b.budget - a.budget);
  } else {
    // Default newest
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 6;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < results.length;

  return {
    items: paginatedItems,
    total: results.length,
    page,
    hasMore
  };
}

export async function mockGetProjectById(projectId) {
  await simulateNetworkDelay(400);
  const project = MOCK_PROJECTS_DATABASE.find((p) => p.id === projectId);
  if (!project) {
    const err = new Error("المشروع المطلوب غير موجود أو تم إغلاقه.");
    err.status = 404;
    throw err;
  }
  return {
    ...project,
    clientHistory: {
      totalHires: 14,
      totalSpentEGP: 85000,
      memberSince: "2024"
    },
    aiRiskAnalysis: {
      compatibilityScore: project.matchPercentage || 85,
      skillGaps: project.matchPercentage < 70 ? ["Firebase"] : [],
      estimatedEffortHours: 35,
      recommendation:
        project.matchPercentage >= 75
          ? "توافق ممتاز! مهاراتك تغطي متطلبات هذا المشروع بنجاح."
          : "تنبيه: المشروع يتطلب مهارات إضافية قد تحتاج لمراجعتها قبل التقديم."
    }
  };
}

export async function mockGenerateAiProposal(projectId) {
  await simulateNetworkDelay(900);
  return {
    generatedCoverLetter:
      "مرحباً بك! اطلعت باهتمام على تفاصيل مشروعكم، ولدي خبرة عملية قوية في تطوير تطبيقات Next.js وبناء واجهات تفاعلية متجاوبة. قمت سابقاً بإنجاز مشاريع مماثلة تعتمد على تصميم نظيف وتكامل مع REST APIs. يسعدني تنفيذ المشروع بأعلى جودة وضمن المدة المحددة مع ضمان الدعم والتعديلات اللازمة.",
    suggestedBid: 6000,
    suggestedDays: 10
  };
}

export async function mockSubmitProposal(proposalData) {
  await simulateNetworkDelay(700);
  return {
    success: true,
    proposalId: `prop_${Date.now()}`,
    message: "تم إرسال عرضك بنجاح للعميل!"
  };
}
