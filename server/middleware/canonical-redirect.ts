export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const url = getRequestURL(event)

  // Normalize public page URLs without changing API or admin requests.
  if (/^\/(?:blogs|hakkimda)(?:\/|$)/.test(url.pathname) && url.pathname.endsWith('/')) {
    return sendRedirect(event, url.pathname.replace(/\/+$/, '') + url.search, 308)
  }
})
