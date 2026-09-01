import api from './api';

// شات بوت SkillBridge (In-House)
const sendChatMessage = async (message, sessionId) => {
  const { data } = await api.post('/ai/chatbot', { message, sessionId });
  return data.data;
};

// تحليل السيرة الذاتية (CV Analysis & Parsing)
const analyzeCV = async (file, targetSkills = []) => {
  const formData = new FormData();
  formData.append('cv', file);
  formData.append('targetSkills', JSON.stringify(targetSkills));

  const { data } = await api.post('/ai/cv/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

// توليد اختبار مهارة (Quiz Generation)
const generateQuiz = async (skill, count = 3) => {
  const { data } = await api.get(`/ai/quiz/${skill}`, { params: { count } });
  return data.data;
};

// تقييم مهمة عملية قصيرة (Practical Task Assessment)
const assessTask = async (payload) => {
  const { data } = await api.post('/ai/assess-task', payload);
  return data.data;
};

// فحص جودة الكود (Code Quality Analysis)
const analyzeCodeQuality = async (code) => {
  const { data } = await api.post('/ai/code/analyze', { code });
  return data.data;
};

export default { sendChatMessage, analyzeCV, generateQuiz, assessTask, analyzeCodeQuality };
