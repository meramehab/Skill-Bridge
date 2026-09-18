import { useState } from 'react';
import aiService from '../services/ai.service';

// هوك بسيط لإدارة تحليل الـ CV واستخراج/تتبع المهارات
const useSkills = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeCV = async (file, targetSkills = []) => {
    try {
      setAnalyzing(true);
      setError(null);
      const data = await aiService.analyzeCV(file, targetSkills);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحليل الملف');
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  return { analyzing, result, error, analyzeCV };
};

export default useSkills;
