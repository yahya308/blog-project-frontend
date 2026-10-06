<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { SITE_AUTHOR_SCHEMA, SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, SITE_URL } from '~/utils/site'

definePageMeta({
  keepalive: true
})

const homeTitle = `${SITE_NAME} | ${SITE_TAGLINE}`

useSeoMeta({
  title: homeTitle,
  description: SITE_DESCRIPTION,
  ogTitle: homeTitle,
  ogDescription: SITE_DESCRIPTION,
  ogType: 'website'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': `${SITE_URL}/`,
      'description': SITE_DESCRIPTION,
      'inLanguage': 'tr-TR',
      'author': SITE_AUTHOR_SCHEMA
    }
  }]
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
  const categoryMap = new Map<string, { id: string, name: string, count: number }>()

  for (const blog of allBlogs.value) {
    for (const category of blog.categories ?? []) {
      const existing = categoryMap.get(category.id)
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        count: (existing?.count ?? 0) + 1
      })
    }
  }

  return Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
})

const initialActivationCompleted = ref(false)

onActivated(() => {
  if (initialActivationCompleted.value) {
    refresh()
  }

  initialActivationCompleted.value = true
})
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
