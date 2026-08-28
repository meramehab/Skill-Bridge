import { defineStore } from 'pinia'
import { api } from '@/services/api'  

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role || 'student',
  },

  actions: {
    async login(email, password) {
      this.isLoading = true
      try {
        const response = await api.post('/auth/login', { email, password })
        this.user = response.data.user
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', this.token)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      try {
        const response = await api.post('/auth/register', userData)
        this.user = response.data.user
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', this.token)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        this.fetchUserProfile()
      }
    },

    async fetchUserProfile() {
      try {
        const response = await api.get('/auth/profile')
        this.user = response.data
      } catch (error) {
        console.error('Error fetching profile:', error)
        this.logout()
      }
    },
  },
})