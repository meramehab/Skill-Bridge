// كل الموديلز هنا مبنية بقواعد ومنطق بسيط (Rule-Based / Heuristic) من غير أي API مدفوع
// الهدف: MVP سريع وبتكلفة صفر، وقابل للاستبدال بموديلات أقوى لاحقًا

// ---------- Code Quality Analysis ----------
// فحص مبدئي بسيط لجودة الكود بناءً على مؤشرات نصية (مش تحليل AST حقيقي)
const analyzeCodeQuality = (codeText) => {
  const issues = [];
  let score = 100;

  if (!codeText || codeText.trim().length === 0) {
    return { score: 0, issues: ['الكود فاضي'] };
  }

  const lines = codeText.split('\n');

  if (lines.length > 300) {
    issues.push('الملف طويل جدًا (أكتر من 300 سطر) - يفضل تقسيمه');
    score -= 10;
  }

  if (/console\.log/.test(codeText)) {
    issues.push('فيه console.log متسيبة في الكود');
    score -= 5;
  }

  if (/var\s+/.test(codeText)) {
    issues.push('استخدام var بدل let/const');
    score -= 5;
  }

  if (!/try\s*{/.test(codeText) && /await\s+/.test(codeText)) {
    issues.push('فيه استخدام await من غير try/catch');
    score -= 10;
  }

  const longLines = lines.filter((l) => l.length > 120).length;
  if (longLines > 0) {
    issues.push(`فيه ${longLines} سطر طويل جدًا (أكتر من 120 حرف)`);
    score -= Math.min(15, longLines);
  }

  score = Math.max(0, score);
  return { score, issues };
};

// ---------- Quiz Generation ----------
// بنك أسئلة ثابت بسيط لكل مهارة - MVP
const QUIZ_BANK = {
  javascript: [
    { question: 'إيه الفرق بين let و var؟', options: ['Scope مختلف', 'مفيش فرق'], answer: 'Scope مختلف' },
    { question: 'إيه هي الـ Promise؟', options: ['كائن لتمثيل عملية غير متزامنة', 'نوع بيانات بسيط'], answer: 'كائن لتمثيل عملية غير متزامنة' },
  ],
  react: [
    { question: 'إيه وظيفة useState؟', options: ['إدارة الحالة داخل الكومبوننت', 'التعامل مع الـ Routing'], answer: 'إدارة الحالة داخل الكومبوننت' },
  ],
  general: [
    { question: 'إيه هو الـ REST API؟', options: ['أسلوب لبناء الـ APIs باستخدام HTTP', 'لغة برمجة'], answer: 'أسلوب لبناء الـ APIs باستخدام HTTP' },
  ],
};

const generateQuiz = (skill, count = 3) => {
  const key = skill ? skill.toLowerCase() : 'general';
  const questions = QUIZ_BANK[key] || QUIZ_BANK.general;
  return questions.slice(0, count);
};

// ---------- Practical Task Assessment ----------
// تقييم مبدئي لمهمة عملية قصيرة بناءً على معايير بسيطة (نسبة إنجاز + وقت التسليم)
const assessPracticalTask = ({ completionPercent, submittedOnTime, meetsRequirements }) => {
  let score = 0;
  score += (completionPercent || 0) * 0.6; // 60% وزن نسبة الإنجاز
  score += submittedOnTime ? 20 : 0; // 20% الالتزام بالوقت
  score += meetsRequirements ? 20 : 0; // 20% مطابقة المتطلبات

  const passed = score >= 60;
  return { score: Math.round(score), passed };
};

// ---------- AI Team Matching ----------
// ترشيح أعضاء لفريق بناءً على تطابق المهارات المطلوبة
const matchTeamMembers = (candidates, requiredSkills) => {
  const requiredSet = requiredSkills.map((s) => s.toLowerCase());

  return candidates
    .map((candidate) => {
      const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());
      const matchCount = requiredSet.filter((s) => candidateSkills.includes(s)).length;
      const matchScore = requiredSet.length ? Math.round((matchCount / requiredSet.length) * 100) : 0;
      return { ...candidate, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

// ---------- AI Job Matching ----------
// ترشيح مشاريع مناسبة لطالب بناءً على مهاراته
const matchJobsForStudent = (studentSkills, projects) => {
  const studentSet = (studentSkills || []).map((s) => s.toLowerCase());

  return projects
    .map((project) => {
      const required = (project.skillsRequired || []).map((s) => s.toLowerCase());
      const matchCount = required.filter((s) => studentSet.includes(s)).length;
      const matchScore = required.length ? Math.round((matchCount / required.length) * 100) : 0;
      return { ...(project.toObject ? project.toObject() : project), matchScore };
    })
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

// ---------- Risk Detection ----------
// تحليل نصي بسيط لمستوى خطورة نزاع بناءً على كلمات مفتاحية
const RISK_KEYWORDS = {
  high: ['احتيال', 'سرقة', 'تهديد', 'ابتزاز', 'نصب'],
  medium: ['تأخير', 'مش مطابق', 'مش متفق عليه', 'رفض التواصل'],
};

const assessDisputeRisk = (reasonText) => {
  const text = (reasonText || '').toLowerCase();

  if (RISK_KEYWORDS.high.some((k) => text.includes(k))) {
    return { riskLevel: 'high', notes: 'تم رصد كلمات دالة على خطورة عالية، يحتاج مراجعة عاجلة' };
  }
  if (RISK_KEYWORDS.medium.some((k) => text.includes(k))) {
    return { riskLevel: 'medium', notes: 'نزاع يحتاج متابعة عادية من فريق الدعم' };
  }
  return { riskLevel: 'low', notes: 'نزاع بسيط، غالبًا قابل للحل السريع' };
};

// ---------- AI Quality Gate ----------
// بوابة جودة أوسع من analyzeCodeQuality: بتضيف فحص أمان مبدئي (Security) فوق فحص الجودة
const SECURITY_PATTERNS = [
  { pattern: /eval\s*\(/, label: 'استخدام eval() خطر أمني محتمل' },
  { pattern: /process\.env\.\w+\s*=\s*['"`]/, label: 'قيمة سرية Hardcoded بدل قراءتها من env' },
  { pattern: /(password|secret|apikey|api_key)\s*[:=]\s*['"`][^'"`]+['"`]/i, label: 'سر أو كلمة مرور مكتوبة مباشرة في الكود' },
  { pattern: /\$\{.*req\.(body|query|params).*\}.*(find|query|exec)\(/is, label: 'احتمال حقن استعلام (Query Injection) من مدخلات المستخدم مباشرة' },
  { pattern: /child_process/, label: 'استخدام child_process - يحتاج مراجعة أمان دقيقة' },
];

const aiQualityGate = (codeText) => {
  const qualityResult = analyzeCodeQuality(codeText);
  const securityIssues = [];

  SECURITY_PATTERNS.forEach(({ pattern, label }) => {
    if (pattern.test(codeText || '')) securityIssues.push(label);
  });

  const securityScore = Math.max(0, 100 - securityIssues.length * 20);
  const passed = qualityResult.score >= 60 && securityIssues.length === 0;

  return {
    qualityScore: qualityResult.score,
    qualityIssues: qualityResult.issues,
    securityScore,
    securityIssues,
    passed,
  };
};

// ---------- Market Predictor ----------
// بيتوقع اتجاهات السوق بناءً على تكرار المهارات في المشاريع المفتوحة (بيانات حقيقية من المنصة)
const predictMarketTrends = (topSkills = []) => {
  // topSkills: [{ skill, demandCount }] جاي من analytics.service
  const total = topSkills.reduce((sum, s) => sum + s.demandCount, 0) || 1;

  return topSkills.map((s, index) => ({
    skill: s.skill,
    demandCount: s.demandCount,
    demandSharePercent: Math.round((s.demandCount / total) * 100),
    trend: index < Math.ceil(topSkills.length / 3) ? 'rising' : 'stable',
  }));
};

// ---------- AI-Jury ----------
// يحلل بيانات النزاع (سبب النزاع + عدد الأدلة المقدمة من كل طرف) ويقترح توصية أولية
const getAIJuryRecommendation = ({ reason, raiserEvidenceCount = 0, defendantEvidenceCount = 0 }) => {
  const risk = assessDisputeRisk(reason);

  let recommendation;
  if (raiserEvidenceCount > defendantEvidenceCount + 1) {
    recommendation = 'الأدلة المقدمة من صاحب الشكوى أقوى نسبيًا - يُرجّح النظر لصالحه مبدئيًا';
  } else if (defendantEvidenceCount > raiserEvidenceCount + 1) {
    recommendation = 'الطرف الآخر قدّم أدلة أكتر - يُرجّح النظر لصالحه مبدئيًا';
  } else {
    recommendation = 'الأدلة من الطرفين متقاربة - يحتاج مراجعة بشرية دقيقة من فريق التحكيم';
  }

  return {
    riskLevel: risk.riskLevel,
    riskNotes: risk.notes,
    recommendation,
    requiresHumanReview: risk.riskLevel !== 'low',
  };
};

module.exports = {
  analyzeCodeQuality,
  generateQuiz,
  assessPracticalTask,
  matchTeamMembers,
  matchJobsForStudent,
  assessDisputeRisk,
  aiQualityGate,
  predictMarketTrends,
  getAIJuryRecommendation,
};
