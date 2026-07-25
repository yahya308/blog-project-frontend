export function useApiClient() {
  const config = useRuntimeConfig();

  function getApiUrl(path: string) {
    const base = String(config.public.apiBase).replace(/\/+$/, "");
    const normalizedPath = path.replace(/^\/+/, "");

    return `${base}/${normalizedPath}`;
  }

  function apiFetch<T>(path: string, options = {}) {
    return $fetch<T>(getApiUrl(path), {
      credentials: "include",
      ...options,
    });
  }

  return {
    getApiUrl,
    apiFetch,
  };
}
