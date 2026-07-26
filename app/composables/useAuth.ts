import { storeToRefs } from 'pinia'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, loading, isAuthenticated } = storeToRefs(authStore)

  return {
    user,
    loading,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    fetchUser: authStore.fetchUser,
    getRedirectPath: authStore.getRedirectPath
  }
}
