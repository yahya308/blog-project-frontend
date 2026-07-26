export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isAuthenticated } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/admin')
  }
})

// store, api ilişkileri, middleware.
