/**
 * @file useAI.js
 * @description React hook providing AI services (CV Analysis, Skill Verification, Quiz Generation, Code Review).
 */
import { useState, useCallback } from "react";
import { aiService } from "../services/aiService";

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const analyzeCV = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiService.analyzeCV(file);
      setResult(response);
      return response;
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء تحليل السيرة الذاتية.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chatAssessment = useCallback(async (messages) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiService.chatAssessment(messages);
      setResult(response);
      return response;
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء إجراء المحادثة الذكية.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifySkill = useCallback(async (skillName, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiService.verifySkill(skillName, data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء التحقق من المهارة.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateQuiz = useCallback(async (skillName, level) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiService.generateQuiz(skillName, level);
      setResult(response);
      return response;
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء توليد الاختبار.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reviewCode = useCallback(async (code, language) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiService.reviewCode(code, language);
      setResult(response);
      return response;
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء مراجعة الكود.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    result,
    analyzeCV,
    chatAssessment,
    verifySkill,
    generateQuiz,
    reviewCode
  };
}

export default useAI;
