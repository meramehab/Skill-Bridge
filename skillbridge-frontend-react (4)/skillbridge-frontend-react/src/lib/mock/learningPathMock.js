/**
 * @file learningPathMock.js
 * @description Mock data and handlers for Personalized Learning Paths and Skill Verifications.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_LEARNING_PATH = {
  id: "lp_frontend_react_01",
  title: "مسار مطور واجهات تفاعلية متقدم (Advanced React Developer)",
  targetRole: "Frontend React Engineer",
  overallProgress: 60, // 60%
  steps: [
    {
      id: "step_01",
      title: "إتقان React Hooks المتقدمة والـ Custom Hooks",
      description: "بناء وفهم دورة حياة المكونات، useReducer، useCallback، وuseMemo وتجنب الـ Re-renders الزائدة.",
      resourceUrl: "https://react.dev/reference/react/hooks",
      status: "completed",
      estimatedMinutes: 180,
      hasAssessment: true,
      assessmentPassed: true
    },
    {
      id: "step_02",
      title: "إدارة الحالة المتقدمة والـ Context API مع Zustand",
      description: "تنظيم تدفق البيانات العالمي وعزل المنطق البرمجي عن طبقة العرض.",
      resourceUrl: "https://zustand-demo.pmnd.rs/",
      status: "completed",
      estimatedMinutes: 240,
      hasAssessment: true,
      assessmentPassed: true
    },
    {
      id: "step_03",
      title: "تطوير تطبيقات بـ Next.js 14 (App Router & SSR/SSG)",
      description: "فهم Server Components و Client Components وتحسين سرعة التحميل و SEO.",
      resourceUrl: "https://nextjs.org/docs",
      status: "in_progress",
      estimatedMinutes: 300,
      hasAssessment: true,
      assessmentPassed: false
    },
    {
      id: "step_04",
      title: "أمان الويب ومصادقة JWT والـ Escrow Flow",
      description: "التعامل مع httpOnly cookies وحماية الـ REST APIs وربط بوابات الدفع.",
      resourceUrl: "https://auth0.com/learn/json-web-tokens",
      status: "not_started",
      estimatedMinutes: 150,
      hasAssessment: true,
      assessmentPassed: false
    },
    {
      id: "step_05",
      title: "مشروع تطبيقي تخرجي: بناء منصة عمل حر مصغرة",
      description: "بناء واجهة حقيقية ورفعها وربطها بالـ Backend لاجتياز اختبار التوثيق الاحترافي.",
      resourceUrl: "https://github.com",
      status: "not_started",
      estimatedMinutes: 480,
      hasAssessment: true,
      assessmentPassed: false
    }
  ]
};

export async function mockGetLearningPath() {
  await simulateNetworkDelay(450);
  return MOCK_LEARNING_PATH;
}

export async function mockUpdateStepStatus(stepId, status) {
  await simulateNetworkDelay(300);
  const step = MOCK_LEARNING_PATH.steps.find((s) => s.id === stepId);
  if (step) {
    step.status = status;
    if (status === "completed") {
      step.assessmentPassed = true;
    }
  }

  // Recalculate overall progress
  const completedCount = MOCK_LEARNING_PATH.steps.filter((s) => s.status === "completed").length;
  MOCK_LEARNING_PATH.overallProgress = Math.round(
    (completedCount / MOCK_LEARNING_PATH.steps.length) * 100
  );

  return {
    success: true,
    updatedStep: step,
    overallProgress: MOCK_LEARNING_PATH.overallProgress,
    message: "تم تحديث حالة المرحلة بنجاح."
  };
}

export async function mockFastTrackVerification(stepId) {
  await simulateNetworkDelay(400);
  return {
    success: true,
    stepId,
    quizUrl: `/assessment/${stepId}`,
    message: "تم التحويل إلى اختبار التقييم المباشر لتخطي المرحلة."
  };
}
