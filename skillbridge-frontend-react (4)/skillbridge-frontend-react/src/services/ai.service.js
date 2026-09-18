import api from './api';

// 1. شات بوت SkillBridge (In-House)
const sendChatMessage = async (message, sessionId) => {
  const { data } = await api.post('/ai/chatbot', { message, sessionId });
  return data.data;
};

// 2. تحليل السيرة الذاتية (CV Analysis & Parsing - Rule-Based)
const analyzeCV = async (file, targetSkills = []) => {
  const formData = new FormData();
  formData.append('cv', file);
  formData.append('targetSkills', JSON.stringify(targetSkills));

  const { data } = await api.post('/ai/cv/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

// 3. تحليل السيرة الذاتية بـ Gemini الحقيقي (Gemini CV Analysis)
const analyzeCVWithGemini = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);

  const { data } = await api.post('/ai/cv/analyze-gemini', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

// 4. فحص جودة الكود (Code Quality Analysis)
const analyzeCodeQuality = async (code) => {
  const { data } = await api.post('/ai/code/analyze', { code });
  return data.data;
};

// 5. توليد اختبار مهارة (Quiz Generation)
const generateQuiz = async (skill, count = 3) => {
  const { data } = await api.get(`/ai/quiz/${skill}`, { params: { count } });
  return data.data;
};

// 6. تقييم مهمة عملية قصيرة (Practical Task Assessment)
const assessTask = async (payload) => {
  const { data } = await api.post('/ai/assess-task', payload);
  return data.data;
};

// 7. تقييم مخاطر النزاع (Dispute Risk Check)
const checkRisk = async (text) => {
  const { data } = await api.post('/ai/risk-check', { text });
  return data.data;
};

// 8. بوابة جودة المشروع والأمان (AI Quality Gate)
const checkQualityGate = async (code) => {
  const { data } = await api.post('/ai/quality-gate', { code });
  return data.data;
};

// 9. توليد عرض تقديم ذكي على مشروع (AI Proposal Generator)
const generateProposal = async (projectId) => {
  const { data } = await api.post(`/ai/proposal/${projectId}`);
  return data.data;
};

// 10. توليد مسودة عقد ذكي (AI Contract Generator)
const generateContract = async (projectId, payload) => {
  const { data } = await api.post(`/ai/contract/${projectId}`, payload);
  return data.data;
};

// 11. توقعات اتجاهات السوق والمهارات (Market Predictor)
const getMarketPredictions = async () => {
  const { data } = await api.get('/ai/market-predictor');
  return data.data;
};

// 12. بناء بورتفوليو تلقائي (AI Portfolio Builder)
const getPortfolio = async () => {
  const { data } = await api.get('/ai/portfolio');
  return data.data;
};

// 13. توصية لجنة التحكيم الذكية - للإدارة فقط (AI Jury Recommendation)
const getJuryRecommendation = async (disputeId) => {
  const { data } = await api.get(`/ai/jury/${disputeId}`);
  return data.data;
};

export default {
  sendChatMessage,
  analyzeCV,
  analyzeCVWithGemini,
  analyzeCodeQuality,
  generateQuiz,
  assessTask,
  checkRisk,
  checkQualityGate,
  generateProposal,
  generateContract,
  getMarketPredictions,
  getPortfolio,
  getJuryRecommendation,
};

