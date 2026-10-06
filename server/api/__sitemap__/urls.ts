interface SitemapBlog {
  slug: string
  updatedAt?: string
  publishedAt?: string | null
}

interface BlogsResponse {
  blogs?: SitemapBlog[]
}

interface SitemapUrl {
  loc: string
  lastmod?: string
}

// Last successful list, so a brief backend outage does not publish a sitemap without articles.
let lastUrls: SitemapUrl[] | null = null

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = `${String(config.backendOrigin).replace(/\/+$/, '')}/api`

  try {
    const response = await $fetch<BlogsResponse>(`${apiBase}/blogs`)

    lastUrls = (response.blogs ?? []).map(blog => ({
      loc: `/blogs/${blog.slug}`,
      lastmod: blog.updatedAt || blog.publishedAt || undefined
    }))

    return lastUrls
  } catch (error) {
    if (lastUrls) return lastUrls

    // The sitemap module logs failed sources instead of silently treating them as empty.
    throw error
  }
})
