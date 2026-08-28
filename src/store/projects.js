import { defineStore } from 'pinia'
import { api } from '@/services/api'  

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    activeProjects: [],
    completedProjects: [],
    isLoading: false,
  }),

  getters: {
    getAllProjects: (state) => state.projects,
    getActiveProjects: (state) => state.activeProjects,
    getCompletedProjects: (state) => state.completedProjects,
    getProjectById: (state) => (id) => state.projects.find(p => p.id === id),
  },

  actions: {
    async fetchProjects() {
      this.isLoading = true
      try {
        const response = await api.get('/projects')
        this.projects = response.data
        this.activeProjects = response.data.filter(p => p.status === 'active' || p.status === 'in_progress')
        this.completedProjects = response.data.filter(p => p.status === 'completed')
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createProject(projectData) {
      try {
        const response = await api.post('/projects', projectData)
        this.projects.push(response.data)
        return { success: true, project: response.data }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async applyToProject(projectId) {
      try {
        await api.post(`/projects/${projectId}/apply`)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async updateProjectStatus(projectId, status) {
      try {
        const response = await api.put(`/projects/${projectId}/status`, { status })
        const index = this.projects.findIndex(p => p.id === projectId)
        if (index !== -1) {
          this.projects[index] = response.data
        }
        return { success: true, project: response.data }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
  },
})