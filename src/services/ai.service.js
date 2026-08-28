import { api } from './api'

export const aiService = {
  async analyzeCV(file) {
    const formData = new FormData()
    formData.append('cv', file)
    const response = await api.post('/ai/analyze-cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async chatAssessment(messages) {
    const response = await api.post('/ai/chat-assessment', { messages })
    return response.data
  },

  async verifySkill(skillName, data) {
    const response = await api.post('/ai/verify-skill', { skillName, ...data })
    return response.data
  },

  async generateQuiz(skillName, level) {
    const response = await api.post('/ai/generate-quiz', { skillName, level })
    return response.data
  },

  async reviewCode(code, language) {
    const response = await api.post('/ai/review-code', { code, language })
    return response.data
  },

  async matchTeam(projectId) {
    const response = await api.post('/ai/match-team', { projectId })
    return response.data
  },
}