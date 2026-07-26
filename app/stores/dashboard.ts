import { defineStore } from 'pinia'
import type { Blog } from '~/types/blog'

interface CategoryDistributionItem {
  id: string
  name: string
  count: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    published: 0,
    draft: 0,
    total: 0,
    categories: 0,
    missingSeo: 0,
    missingCover: 0
  })
  const recentBlogs = ref<Blog[]>([])
  const categoryDistribution = ref<CategoryDistributionItem[]>([])
  const loading = ref(true)

  function isMissingSeo(blog: Blog) {
    return !blog.seoTitle?.trim() || !blog.seoDescription?.trim()
  }

  function buildCategoryDistribution(blogs: Blog[]) {
    const counts = new Map<string, CategoryDistributionItem>()

    for (const blog of blogs) {
      if (blog.status !== 'PUBLISHED') {
        continue
      }

      for (const category of blog.categories ?? []) {
        const existing = counts.get(category.id)

        if (existing) {
          existing.count += 1
        } else {
          counts.set(category.id, {
            id: category.id,
            name: category.name,
            count: 1
          })
        }
      }
    }

    return Array.from(counts.values()).sort((a, b) => b.count - a.count)
  }

  async function fetchDashboardData() {
    const { getBlogStats, getBlogsList } = useBlogsApi()
    const { getCategories } = useCategoriesApi()

    loading.value = true

    try {
      const [blogStats, categories, blogsResult] = await Promise.all([
        getBlogStats(),
        getCategories(),
        getBlogsList({ limit: 50 })
      ])

      const blogs = blogsResult.blogs

      stats.value = {
        ...blogStats,
        categories: categories.length,
        missingSeo: blogs.filter(isMissingSeo).length,
        missingCover: blogs.filter(blog => !blog.coverImage?.trim()).length
      }

      recentBlogs.value = [...blogs]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

      categoryDistribution.value = buildCategoryDistribution(blogs)
    } catch {
      stats.value = {
        published: 0,
        draft: 0,
        total: 0,
        categories: 0,
        missingSeo: 0,
        missingCover: 0
      }
      recentBlogs.value = []
      categoryDistribution.value = []
    } finally {
      loading.value = false
    }
  }

  function resetStats() {
    stats.value = {
      published: 0,
      draft: 0,
      total: 0,
      categories: 0,
      missingSeo: 0,
      missingCover: 0
    }
    recentBlogs.value = []
    categoryDistribution.value = []
    loading.value = true
  }

  return {
    stats,
    recentBlogs,
    categoryDistribution,
    loading,
    fetchDashboardData,
    resetStats
  }
})
