import { defineStore } from 'pinia'
import { api } from '@/services/api'
export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [],
    verifiedSkills: [],
    isLoading: false,
    careerReadinessScore: 0,
  }),

  getters: {
    getAllSkills: (state) => state.skills,
    getVerifiedSkills: (state) => state.verifiedSkills,
    getCareerReadiness: (state) => state.careerReadinessScore,
  },

  actions: {
    async fetchSkills() {
      this.isLoading = true
      try {
        const response = await api.get('/skills')
        this.skills = response.data
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        this.isLoading = false
      }
    },

    async verifySkill(skillId, data) {
      try {
        const response = await api.post(`/skills/${skillId}/verify`, data)
        this.verifiedSkills.push(response.data)
        await this.calculateReadinessScore()
        return { success: true, result: response.data }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async calculateReadinessScore() {
      try {
        const response = await api.get('/skills/readiness-score')
        this.careerReadinessScore = response.data.score
        return response.data.score
      } catch (error) {
        console.error('Error calculating score:', error)
        return 0
      }
    },
  },
})