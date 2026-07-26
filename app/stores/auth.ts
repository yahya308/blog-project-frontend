import { defineStore } from 'pinia'
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  MeResponse
} from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function fetchUser() {
    try {
      const { apiFetch } = useApiClient()
      const response = await apiFetch<MeResponse>('auth/me')

      user.value = response.user
      return response.user
    } catch {
      user.value = null
      return null
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true

    try {
      const { apiFetch } = useApiClient()
      const response = await apiFetch<LoginResponse>('auth/login', {
        method: 'POST',
        body: credentials
      })

      user.value = response.user
      return response.user
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      const { apiFetch } = useApiClient()
      await apiFetch<LogoutResponse>('auth/logout', {
        method: 'POST'
      })
    } finally {
      user.value = null
    }
  }

  function getRedirectPath() {
    return '/admin/dashboard'
  }

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    login,
    logout,
    getRedirectPath
  }
})
