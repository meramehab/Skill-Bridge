import { ref } from 'vue'
import { aiService } from '@/services/ai.service'

export function useAI() {
  const isLoading = ref(false)
  const error = ref(null)
  const result = ref(null)

  const analyzeCV = async (file) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await aiService.analyzeCV(file)
      result.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const chatAssessment = async (messages) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await aiService.chatAssessment(messages)
      result.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifySkill = async (skillName, data) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await aiService.verifySkill(skillName, data)
      result.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const generateQuiz = async (skillName, level) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await aiService.generateQuiz(skillName, level)
      result.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reviewCode = async (code, language) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await aiService.reviewCode(code, language)
      result.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    result,
    analyzeCV,
    chatAssessment,
    verifySkill,
    generateQuiz,
    reviewCode,
  }
}