export function useApiClient() {
  const config = useRuntimeConfig()

  function getApiUrl(path: string) {
    const base = String(config.public.apiBase).replace(/\/+$/, '')
    const normalizedPath = path.replace(/^\/+/, '')
    return `${base}/${normalizedPath}`
  }

  async function apiFetch<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> {
    const forwardedHeaders = import.meta.server
      ? useRequestHeaders(['cookie'])
      : undefined

    return await $fetch<T>(getApiUrl(path), {
      credentials: 'include',
      ...options,
      headers: {
        ...forwardedHeaders,
        ...(options.headers as Record<string, string> | undefined)
      }
    })
  }

  return {
    getApiUrl,
    apiFetch
  }
}
