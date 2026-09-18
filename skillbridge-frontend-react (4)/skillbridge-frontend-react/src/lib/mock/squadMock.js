/**
 * @file squadMock.js
 * @description Mock data for Squad management, formation, matchmaking and join requests.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";
import { MOCK_CURRENT_USER } from "./authMock";

export const MOCK_SQUADS_DATABASE = [
  {
    id: "sq_alpha_01",
    name: "فريق النخبة البرمجية (Alpha Squad)",
    description: "فريق متخصص في تطوير حلول Full-Stack وبناء تطبيقات الذكاء الاصطناعي للمؤسسات.",
    leaderId: "std_10293",
    members: [
      MOCK_CURRENT_USER,
      {
        id: "std_204",
        name: "نورا سامح",
        university: "جامعة القاهرة",
        faculty: "حاسبات",
        verifiedSkills: ["Node.js", "Express", "PostgreSQL"],
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120"
      },
      {
        id: "std_305",
        name: "يوسف إبراهيم",
        university: "جامعة عين شمس",
        faculty: "هندسة",
        verifiedSkills: ["UI/UX", "Figma"],
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120"
      }
    ],
    maxMembers: 5,
    neededSkills: ["DevOps", "Docker", "Python AI"],
    isVerified: true,
    totalCompletedProjects: 4,
    squadScore: 1850,
    isOpenForJoin: true
  },
  {
    id: "sq_beta_02",
    name: "رواد الموبايل (Mobile Pioneers)",
    description: "فريق يركز على تطبيقات Flutter و React Native للمشاريع التجارية والجامعية.",
    leaderId: "std_9001",
    members: [
      {
        id: "std_9001",
        name: "كريم شريف",
        university: "جامعة حلوان",
        faculty: "حاسبات",
        verifiedSkills: ["Flutter", "Dart", "Firebase"],
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
      }
    ],
    maxMembers: 4,
    neededSkills: ["Flutter", "UI Design", "Backend API"],
    isVerified: false,
    totalCompletedProjects: 1,
    squadScore: 540,
    isOpenForJoin: true
  }
];

export const MOCK_JOIN_REQUESTS_DATABASE = [
  {
    id: "req_701",
    squadId: "sq_alpha_01",
    student: {
      id: "std_7788",
      name: "حسام الدين طارق",
      university: "جامعة القاهرة",
      faculty: "حاسبات",
      verifiedSkills: ["Docker", "Linux", "CI/CD"],
      careerReadinessScore: 82,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120"
    },
    message: "أرغب في الانضمام كمسؤول DevOps، لدي خبرة عملية في إعداد حاويات Docker ونشر المشاريع على VPS.",
    status: "pending",
    createdAt: "2026-08-27T10:00:00Z"
  }
];

export async function mockGetMySquad(userId) {
  await simulateNetworkDelay(400);
  const squad = MOCK_SQUADS_DATABASE.find(
    (s) => s.leaderId === userId || s.members.some((m) => m.id === userId)
  );
  return squad || null;
}

export async function mockGetOpenSquads(filters = {}) {
  await simulateNetworkDelay(450);
  let list = MOCK_SQUADS_DATABASE.filter((s) => s.isOpenForJoin);
  if (filters.skill) {
    list = list.filter((s) =>
      s.neededSkills.some((nsk) => nsk.toLowerCase().includes(filters.skill.toLowerCase()))
    );
  }
  return {
    items: list,
    total: list.length
  };
}

export async function mockCheckSquadNameAvailability(name) {
  await simulateNetworkDelay(300);
  const exists = MOCK_SQUADS_DATABASE.some(
    (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  return {
    isAvailable: !exists,
    message: exists ? "اسم الفريق مستخدم بالفعل، يرجى اختيار اسم آخر." : "اسم الفريق متاح."
  };
}

export async function mockCreateSquad(squadData) {
  await simulateNetworkDelay(600);
  const newSquad = {
    id: `sq_${Date.now()}`,
    name: squadData.name,
    description: squadData.description,
    leaderId: MOCK_CURRENT_USER.id,
    members: [MOCK_CURRENT_USER],
    maxMembers: Number(squadData.maxMembers) || 5,
    neededSkills: Array.isArray(squadData.neededSkills) ? squadData.neededSkills : [],
    isVerified: false,
    totalCompletedProjects: 0,
    squadScore: 100,
    isOpenForJoin: true
  };
  MOCK_SQUADS_DATABASE.push(newSquad);
  return newSquad;
}

export async function mockApplyToSquad(squadId, message) {
  await simulateNetworkDelay(400);
  return {
    success: true,
    requestId: `req_${Date.now()}`,
    message: "تم إرسال طلب الانضمام لقائد الفريق بنجاح."
  };
}

export async function mockGetSquadJoinRequests(squadId) {
  await simulateNetworkDelay(300);
  return MOCK_JOIN_REQUESTS_DATABASE.filter((r) => r.squadId === squadId && r.status === "pending");
}

export async function mockHandleJoinRequest(requestId, action) {
  await simulateNetworkDelay(400);
  const req = MOCK_JOIN_REQUESTS_DATABASE.find((r) => r.id === requestId);
  if (req) {
    req.status = action === "accept" ? "accepted" : "rejected";
    if (action === "accept") {
      const squad = MOCK_SQUADS_DATABASE.find((s) => s.id === req.squadId);
      if (squad && !squad.members.some((m) => m.id === req.student.id)) {
        squad.members.push(req.student);
      }
    }
  }
  return {
    success: true,
    message: action === "accept" ? "تم قبول العضو وإضافته للفريق!" : "تم رفض الطلب."
  };
}

export async function mockGetAiSquadRecommendations(squadId) {
  await simulateNetworkDelay(700);
  return [
    {
      studentId: "std_rec_01",
      name: "زياد طارق",
      university: "جامعة عين شمس",
      faculty: "حاسبات ومعلومات",
      skills: ["DevOps", "Docker", "Kubernetes"],
      compatibilityScore: 94,
      reason: "يمتلك مهارات DevOps المطلوبة في فريقك ومسجل بأداء مرتفع في المشاريع السابقة."
    },
    {
      studentId: "std_rec_02",
      name: "منة الله عصام",
      university: "جامعة القاهرة",
      faculty: "هندسة",
      skills: ["Python AI", "FastAPI", "Machine Learning"],
      compatibilityScore: 89,
      reason: "تغطي النقص في تقنيات الذكاء الاصطناعي وبنت مشروع تخرج مماثل."
    }
  ];
}
