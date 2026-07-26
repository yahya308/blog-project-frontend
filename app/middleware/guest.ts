export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isAuthenticated, getRedirectPath } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  if (isAuthenticated.value && user.value) {
    return navigateTo(getRedirectPath())
  }
})
