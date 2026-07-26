import type { Blog, BlogStatus, CreateBlogPayload, UpdateBlogPayload } from '~/types/blog'
import { normalizeImageUrl } from '~/utils/image'

type ServerBlogStatus = 'TASLAK' | 'YAYINDA'
type ServerBlog = Omit<Blog, 'status'> & { status: ServerBlogStatus }

interface BlogsResponse {
  success: boolean
  message: string
  blogs: ServerBlog[]
}

interface BlogResponse {
  success: boolean
  message?: string
  blog: ServerBlog
}

interface MutationResponse {
  success: boolean
  message: string
}

function normalizeBlog(blog: ServerBlog): Blog {
  return {
    ...blog,
    status: blog.status === 'YAYINDA' ? 'PUBLISHED' : 'DRAFT',
    authorName: blog.authorName?.trim() || blog.author?.name || null,
    coverImage: normalizeImageUrl(blog.coverImage)
  }
}

function serializePayload(payload: CreateBlogPayload | UpdateBlogPayload) {
  return {
    title: payload.title,
    slug: payload.slug,
    content: payload.content,
    excerpt: payload.excerpt,
    coverImage: payload.coverImage,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    seoKeywords: payload.seoKeywords,
    authorName: payload.authorName,
    status: payload.status === 'PUBLISHED' ? 'YAYINDA' : 'TASLAK',
    publishedAt: payload.publishedAt,
    categoryIds: payload.categoryIds
  }
}

export function useBlogsApi() {
  const { apiFetch } = useApiClient()

  async function getBlogStats() {
    const blogs = await getBlogs()
    return {
      published: blogs.filter(blog => blog.status === 'PUBLISHED').length,
      draft: blogs.filter(blog => blog.status === 'DRAFT').length,
      total: blogs.length
    }
  }

  async function getBlogsList(options?: { status?: BlogStatus, limit?: number }) {
    const response = await apiFetch<BlogsResponse>('blogs/admin')
    const normalized = response.blogs.map(normalizeBlog)
    const filtered = options?.status
      ? normalized.filter(blog => blog.status === options.status)
      : normalized
    const total = filtered.length

    return {
      blogs: filtered.slice(0, options?.limit ?? 50),
      total
    }
  }

  async function getPublishedBlogs(limit = 50) {
    const response = await apiFetch<BlogsResponse>('blogs')
    return response.blogs.map(normalizeBlog).slice(0, limit)
  }

  function getBlogs() {
    return getBlogsList().then(result => result.blogs)
  }

  async function getBlogById(id: string) {
    const response = await apiFetch<BlogResponse>(`blogs/admin/${id}`)
    return normalizeBlog(response.blog)
  }

  async function getPublishedBlogBySlug(slug: string) {
    const response = await apiFetch<BlogResponse>(`blogs/${slug}`)
    return normalizeBlog(response.blog)
  }

  async function createBlog(payload: CreateBlogPayload) {
    const response = await apiFetch<BlogResponse>('blogs', {
      method: 'POST',
      body: serializePayload(payload)
    })
    return normalizeBlog(response.blog)
  }

  async function updateBlog(id: string, payload: UpdateBlogPayload) {
    const response = await apiFetch<BlogResponse>(`blogs/admin/${id}`, {
      method: 'PATCH',
      body: serializePayload(payload)
    })
    return normalizeBlog(response.blog)
  }

  async function deleteBlog(id: string) {
    await apiFetch<MutationResponse>(`blogs/admin/${id}`, {
      method: 'DELETE'
    })
    return { id }
  }

  return {
    getBlogs,
    getBlogsList,
    getPublishedBlogs,
    getBlogById,
    getPublishedBlogBySlug,
    getBlogStats,
    createBlog,
    updateBlog,
    deleteBlog
  }
}
