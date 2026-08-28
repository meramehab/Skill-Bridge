import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userRole = computed(() => authStore.userRole)
  const isLoading = computed(() => authStore.isLoading)

  const login = async (email, password) => {
    return await authStore.login(email, password)
  }

  const register = async (userData) => {
    return await authStore.register(userData)
  }

  const logout = () => {
    authStore.logout()
  }

  const checkAuth = () => {
    authStore.checkAuth()
  }

  return {
    isLoggedIn,
    user,
    userRole,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  }
}