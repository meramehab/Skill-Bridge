// AI Portfolio Builder - يجمع بيانات الطالب (CV + المهارات + المشاريع المنجزة) في بورتفوليو منظم
// MVP: تجميع وتنظيم بيانات موجودة بالفعل، مفيش أي توليد بالذكاء الاصطناعي المدفوع

const buildPortfolio = ({ user, completedProjects = [], cv = null, leaderboard = null }) => {
  return {
    profile: {
      name: user.fullName,
      university: user.university,
      bio: user.bio,
      isUniversityVerified: user.isUniversityVerified,
      careerReadinessScore: user.careerReadinessScore,
    },

    skills: user.skills || [],

    projects: completedProjects.map((p) => ({
      title: p.title,
      description: p.description,
      budget: p.budget,
      completedAt: p.updatedAt,
    })),

    cvHighlights: cv
      ? {
          extractedSkills: cv.extractedSkills,
          careerReadinessScore: cv.careerReadinessScore,
        }
      : null,

    achievements: leaderboard
      ? {
          rankTitle: leaderboard.rankTitle,
          experiencePoints: leaderboard.experiencePoints,
          badges: leaderboard.badges,
          completedProjectsCount: leaderboard.completedProjects,
        }
      : null,

    generatedAt: new Date(),
  };
};

module.exports = { buildPortfolio };
