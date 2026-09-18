/**
 * @file authMock.js
 * @description Mock responses for authentication and registration flows.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_CURRENT_USER = {
  id: "std_10293",
  name: "أحمد محمود علي",
  email: "ahmed.ali@eng.cu.edu.eg",
  university: "جامعة القاهرة",
  faculty: "كلية الهندسة - قسم حاسبات",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  bio: "مطور واجهات أمامية طموح، شغوف بـ React و Next.js وواجهات المستخدم التفاعلية.",
  careerReadinessScore: 85, // >= 70 unlocks freelancing
  freelancingLevel: "Intermediate",
  verifiedSkills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Git & GitHub", "REST APIs"],
  isFreelancingUnlocked: true,
  isVerifiedStudent: true,
  reputationScore: 420,
  completedProjectsCount: 3,
  squadId: "sq_alpha_01"
};

export const MOCK_UNVERIFIED_USER = {
  ...MOCK_CURRENT_USER,
  id: "std_99887",
  name: "سارة محمد إبراهيم",
  email: "sara.m@alexu.edu.eg",
  careerReadinessScore: 45,
  isFreelancingUnlocked: false,
  isVerifiedStudent: false,
  squadId: null
};

export async function mockLogin({ email, password, rememberMe }) {
  await simulateNetworkDelay(600);

  if (email.includes("unverified")) {
    const error = new Error("الحساب غير موثق جامعيًا بعد. يرجى إتمام التحقق من الكارنيه الجامعي.");
    error.code = "ACCOUNT_NOT_VERIFIED";
    error.status = 403;
    throw error;
  }

  if (password === "wrongpass") {
    const error = new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    error.code = "INVALID_CREDENTIALS";
    error.status = 400;
    throw error;
  }

  return {
    success: true,
    token: "mock_jwt_token_sample_xyz789",
    user: MOCK_CURRENT_USER
  };
}

export async function mockRegister(formData) {
  await simulateNetworkDelay(800);
  return {
    success: true,
    token: "mock_jwt_token_sample_registered_123",
    user: {
      ...MOCK_UNVERIFIED_USER,
      name: formData.name || "مستخدم جديد",
      email: formData.email || "student@cu.edu.eg",
      university: formData.university || "جامعة القاهرة",
      faculty: formData.faculty || "حاسبات ومعلومات"
    },
    message: "تم إنشاء الحساب بنجاح وتم إرسال الكارنيه للتحقق."
  };
}

export async function mockGetCurrentUser() {
  await simulateNetworkDelay(300);
  return {
    user: MOCK_CURRENT_USER
  };
}
