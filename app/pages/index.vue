<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE } from '~/utils/site'

definePageMeta({
  keepalive: true
})

useSeoMeta({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  ogTitle: `${SITE_NAME} | ${SITE_TAGLINE}`,
  ogDescription: SITE_DESCRIPTION,
  ogType: 'website',
  ogLocale: 'tr_TR',
  twitterCard: 'summary_large_image',
  twitterTitle: SITE_NAME,
  twitterDescription: SITE_DESCRIPTION
})

const { getPublishedBlogs } = useBlogsApi()

const {
  data: publishedBlogs,
  pending: loading,
  error: blogsError,
  refresh
} = await useAsyncData<Blog[]>('home-published-blogs', () => getPublishedBlogs())

const allBlogs = computed(() => publishedBlogs.value ?? [])
const featuredBlog = computed(() => allBlogs.value[0] ?? null)
const latestBlogs = computed(() => allBlogs.value.slice(1, 4))
const error = computed(() => Boolean(blogsError.value))

const categories = computed(() => {
  const categoryMap = new Map<string, { id: string, name: string, slug: string, count: number }>()

  for (const blog of allBlogs.value) {
    for (const category of blog.categories ?? []) {
      const existing = categoryMap.get(category.id)
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: (existing?.count ?? 0) + 1
      })
    }
  }

  return Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
})

onActivated(refresh)
</script>

<template>
  <div class="relative overflow-hidden">
    <HomeHero
      :featured-blog="featuredBlog"
      :loading="loading"
    />
    <HomeLatestPosts
      :blogs="latestBlogs"
      :loading="loading"
      :error="error"
      @retry="refresh"
    />
    <HomeCategoryExplorer :categories="categories" />
    <HomeNow />
    <HomeAbout />
  </div>
</template>
