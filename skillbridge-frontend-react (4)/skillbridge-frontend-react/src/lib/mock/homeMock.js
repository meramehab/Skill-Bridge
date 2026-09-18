/**
 * @file homeMock.js
 * @description Mock statistics and featured content for the Landing / Home page.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_HOME_STATS = {
  totalStudents: 14850,
  completedProjects: 3240,
  partnerUniversities: 27,
  totalEarningsEGP: 2450000,
  topSkillsInDemand: ["React.js", "Node.js", "UI/UX Design", "Python AI", "Flutter"],
  featuredProjects: [
    {
      id: "proj_feat_01",
      title: "تطوير لوحة تحكم إدارية لشركة لوجستية ناشئة",
      budget: 8500,
      type: "project",
      requiredSkills: ["React.js", "Tailwind CSS", "REST API"],
      clientName: "شركة إيجيبت إكسبريس",
      proposalsCount: 6
    },
    {
      id: "proj_feat_02",
      title: "تصميم واجهة مستخدم لتطبيق توصيل جامعي (Figma)",
      budget: 3200,
      type: "micro_gig",
      requiredSkills: ["UI/UX Design", "Figma", "Design Systems"],
      clientName: "مبادرة يوني كارت",
      proposalsCount: 12
    }
  ],
  topStudents: [
    {
      id: "std_top_01",
      name: "ياسمين خالد",
      university: "جامعة عين شمس",
      faculty: "حاسبات ومعلومات",
      xp: 3450,
      freelancingLevel: "Professional",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
    },
    {
      id: "std_top_02",
      name: "عمر حسن",
      university: "جامعة الإسكندرية",
      faculty: "هندسة",
      xp: 2980,
      freelancingLevel: "Professional",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
    }
  ]
};

export async function mockGetHomeStats() {
  await simulateNetworkDelay(400);
  return MOCK_HOME_STATS;
}
