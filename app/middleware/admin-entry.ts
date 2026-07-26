export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isAuthenticated } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  return navigateTo(
    isAuthenticated.value ? '/admin/dashboard' : '/admin/login',
    { replace: true }
  )
})
