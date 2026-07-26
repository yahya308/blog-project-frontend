interface SitemapBlog {
  slug: string
  updatedAt?: string
  publishedAt?: string | null
}

interface BlogsResponse {
  blogs?: SitemapBlog[]
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = `${String(config.backendOrigin).replace(/\/+$/, '')}/api`

  try {
    const response = await $fetch<BlogsResponse>(`${apiBase}/blogs`)

    return (response.blogs ?? []).map(blog => ({
      loc: `/blogs/${blog.slug}`,
      lastmod: blog.updatedAt || blog.publishedAt || undefined
    }))
  } catch {
    return []
  }
})
