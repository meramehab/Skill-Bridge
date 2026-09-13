const fs = require('fs');
const pdfParse = require('pdf-parse');

// قائمة مهارات مرجعية بسيطة نقارن بيها نص الـ CV - MVP (من غير أي API مدفوع)
// ممكن توسعها براحتك لاحقًا
const SKILLS_DB = [
  'javascript', 'typescript', 'node.js', 'nodejs', 'express', 'react', 'next.js',
  'vue', 'angular', 'mongodb', 'mongoose', 'postgresql', 'mysql', 'sql',
  'python', 'django', 'flask', 'java', 'spring', 'php', 'laravel',
  'html', 'css', 'tailwind', 'bootstrap', 'git', 'docker', 'kubernetes',
  'aws', 'firebase', 'rest api', 'graphql', 'jwt', 'redux', 'testing',
  'figma', 'ui/ux', 'machine learning', 'data analysis', 'c++', 'c#', '.net',
];

// استخراج النص من ملف PDF
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Skill Extraction from CV - استخراج المهارات بمطابقة كلمات مفتاحية بسيطة
const extractSkillsFromText = (text) => {
  const lowerText = text.toLowerCase();
  const foundSkills = SKILLS_DB.filter((skill) => lowerText.includes(skill));
  return [...new Set(foundSkills)];
};

// Missing Skills Detection - بمقارنة مهارات الطالب بمهارات مطلوبة لمسار معين
const detectMissingSkills = (studentSkills, requiredSkills) => {
  const studentSet = new Set(studentSkills.map((s) => s.toLowerCase()));
  return requiredSkills.filter((skill) => !studentSet.has(skill.toLowerCase()));
};

// Career Readiness Score - نسبة بسيطة بناءً على عدد المهارات المطابقة لمسار مستهدف
const calculateCareerReadinessScore = (studentSkills, targetPathSkills) => {
  if (!targetPathSkills || targetPathSkills.length === 0) return 0;
  const studentSet = new Set(studentSkills.map((s) => s.toLowerCase()));
  const matched = targetPathSkills.filter((s) => studentSet.has(s.toLowerCase()));
  return Math.round((matched.length / targetPathSkills.length) * 100);
};

// Personalized Learning Path - اقتراح مصادر تعلم بسيطة للمهارات الناقصة
const LEARNING_RESOURCES = {
  javascript: 'freeCodeCamp - JavaScript Algorithms and Data Structures',
  react: 'React Official Docs + Scrimba React Course',
  'node.js': 'Node.js - The Complete Guide (Udemy)',
  mongodb: 'MongoDB University - M001 Basics',
  python: 'CS50P - Introduction to Programming with Python',
  sql: 'SQLBolt - Interactive SQL Tutorial',
  git: 'Git & GitHub Crash Course',
};

const buildLearningPath = (missingSkills) => {
  return missingSkills.map((skill) => ({
    skill,
    resourceSuggestion: LEARNING_RESOURCES[skill.toLowerCase()] || `ابحث عن كورس مقدمة في ${skill}`,
  }));
};

// تحليل شامل لملف CV: بيرجع كل النتائج مرة واحدة
const analyzeCV = async (filePath, targetPathSkills = []) => {
  const rawText = await extractTextFromPDF(filePath);
  const extractedSkills = extractSkillsFromText(rawText);
  const missingSkills = detectMissingSkills(extractedSkills, targetPathSkills);
  const careerReadinessScore = calculateCareerReadinessScore(extractedSkills, targetPathSkills);
  const suggestedLearningPath = buildLearningPath(missingSkills);

  return {
    rawText,
    extractedSkills,
    missingSkills,
    careerReadinessScore,
    suggestedLearningPath,
  };
};

module.exports = {
  extractTextFromPDF,
  extractSkillsFromText,
  detectMissingSkills,
  calculateCareerReadinessScore,
  buildLearningPath,
  analyzeCV,
};
