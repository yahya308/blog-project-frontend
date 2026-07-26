export function useApiClient() {
  const config = useRuntimeConfig();

  function getApiUrl(path: string) {
    const base = import.meta.server
      ? `${config.backendOrigin}/api`
      : config.public.apiBase;

    const normalizedBase = String(base).replace(/\/+$/, "");
    const normalizedPath = path.replace(/^\/+/, "");

    return `${normalizedBase}/${normalizedPath}`;
  }

  async function apiFetch<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    const forwardedHeaders = import.meta.server
      ? useRequestHeaders(["cookie"])
      : undefined;

    return await $fetch<T>(getApiUrl(path), {
      credentials: "include",
      ...options,
      headers: {
        ...forwardedHeaders,
        ...(options.headers as Record<string, string> | undefined),
      },
    });
  }

  return {
    getApiUrl,
    apiFetch,
  };
}
