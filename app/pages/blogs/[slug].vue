<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getBlogAuthorName } from '~/utils/blog'
import { getImageSrcSet, getOptimizedImageUrl } from '~/utils/image'

const route = useRoute()
const toast = useToast()
const { getPublishedBlogBySlug, getPublishedBlogs } = useBlogsApi()
const blogSlug = computed(() => String(route.params.slug))
const articleRef = ref<HTMLElement | null>(null)
const coverImageRef = ref<HTMLImageElement | null>(null)
const readingProgress = ref(0)
const coverImageFailed = ref(false)
const coverImageLoaded = ref(false)
let progressFrame: number | null = null

const {
  data: pageData,
  pending: loading,
  error: pageError
} = await useAsyncData(`blog-page-${blogSlug.value}`, async () => {
  const [currentBlog, publishedBlogs] = await Promise.all([
    getPublishedBlogBySlug(blogSlug.value),
    getPublishedBlogs()
  ])

  if (currentBlog.status !== 'PUBLISHED') {
    throw createError({ statusCode: 404, statusMessage: 'Blog bulunamadı' })
  }

  const categoryIds = new Set(currentBlog.categories?.map(category => category.id) ?? [])
  const otherBlogs = publishedBlogs.filter(blog => blog.id !== currentBlog.id)
  const matching = otherBlogs.filter(blog =>
    blog.categories?.some(category => categoryIds.has(category.id))
  )
  const remaining = otherBlogs.filter(blog => !matching.some(item => item.id === blog.id))

  return {
    blog: currentBlog,
    relatedBlogs: [...matching, ...remaining].slice(0, 3)
  }
})

const blog = computed<Blog | null>(() => pageData.value?.blog ?? null)
const relatedBlogs = computed(() => pageData.value?.relatedBlogs ?? [])
const notFound = computed(() => Boolean(pageError.value) || (!loading.value && !blog.value))
const authorName = computed(() => blog.value ? getBlogAuthorName(blog.value) : '')

const readingMinutes = computed(() => {
  const plainText = blog.value?.content.replace(/<[^>]*>/g, ' ') ?? ''
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

const seoTitle = computed(() => blog.value?.seoTitle || blog.value?.title || 'Blog')
const seoDescription = computed(() => blog.value?.seoDescription || blog.value?.excerpt || '')
const coverImageSrcSet = computed(() =>
  blog.value?.coverImage && !coverImageFailed.value
    ? getImageSrcSet(blog.value.coverImage, [640, 960, 1280], { quality: 82, fit: 'max' })
    : undefined
)

watch(() => blog.value?.coverImage, () => {
  coverImageFailed.value = false
  coverImageLoaded.value = false
  nextTick(checkCoverImage)
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: () => blog.value?.coverImage || undefined,
  ogType: 'article',
  twitterCard: 'summary_large_image'
})

useHead(() => ({
  meta: blog.value?.seoKeywords
    ? [{ name: 'keywords', content: blog.value.seoKeywords }]
    : []
}))

function formatDate(value?: string | null) {
  if (!value) return ''

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}

function updateReadingProgress() {
  if (progressFrame !== null) return

  progressFrame = requestAnimationFrame(() => {
    progressFrame = null
    if (!articleRef.value) return

    const start = articleRef.value.offsetTop
    const distance = Math.max(1, articleRef.value.offsetHeight - window.innerHeight)
    readingProgress.value = Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100))
  })
}

function handleCoverImageError() {
  coverImageFailed.value = true
}

function checkCoverImage() {
  const image = coverImageRef.value
  if (!image?.complete) {
    return
  }

  coverImageFailed.value = image.naturalWidth === 0
  coverImageLoaded.value = image.naturalWidth > 0
}

async function shareArticle() {
  if (!blog.value) return

  const shareData = {
    title: blog.value.title,
    text: blog.value.excerpt || blog.value.title,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(shareData.url)
    toast.add({ title: 'Bağlantı kopyalandı', color: 'success' })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    console.error('İçerik paylaşılırken hata oluştu:', error)
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  updateReadingProgress()
  nextTick(checkCoverImage)
})

onUnmounted(() => {
  if (progressFrame !== null) cancelAnimationFrame(progressFrame)
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>

<template>
  <div>
    <div
      class="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        class="h-full bg-primary transition-[width] duration-100"
        :style="{ width: `${readingProgress}%` }"
      />
    </div>

    <div
      v-if="loading"
      class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div class="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-8 h-12 w-full max-w-2xl animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-5 h-6 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-10 aspect-[16/9] animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
    </div>

    <div
      v-else-if="notFound || !blog"
      class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <UIcon
        name="i-lucide-file-question"
        class="size-10 text-neutral-400"
      />
      <h1 class="mt-5 text-2xl font-bold">
        Blog bulunamadı
      </h1>
      <p class="mt-2 text-neutral-500">
        Aradığınız yazı mevcut değil veya henüz yayınlanmamış.
      </p>
      <UButton
        to="/blogs"
        class="mt-6"
        label="Tüm Yazılara Dön"
        icon="i-lucide-arrow-left"
        variant="outline"
      />
    </div>

    <article
      v-else
      ref="articleRef"
    >
      <header class="relative overflow-hidden border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div class="pointer-events-none absolute -right-24 top-6 size-72 rounded-full bg-primary/5 blur-3xl" />
        <div class="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <NuxtLink
            to="/blogs"
            class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-primary"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4"
            />
            Tüm yazılar
          </NuxtLink>

          <div
            v-if="blog.categories?.length"
            class="mt-7 flex flex-wrap gap-2"
          >
            <NuxtLink
              v-for="category in blog.categories"
              :key="category.id"
              :to="{ path: '/blogs', query: { category: category.id } }"
              class="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary transition hover:border-primary/25 hover:bg-primary/10"
            >
              {{ category.name }}
            </NuxtLink>
          </div>

          <h1 class="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white">
            {{ blog.title }}
          </h1>

          <p
            v-if="blog.excerpt"
            class="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300"
          >
            {{ blog.excerpt }}
          </p>

          <div class="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span
              v-if="authorName"
              class="font-semibold text-neutral-700 dark:text-neutral-200"
            >
              {{ authorName }}
            </span>
            <span
              v-if="authorName && blog.publishedAt"
              class="text-neutral-300 dark:text-neutral-700"
              aria-hidden="true"
            >•</span>
            <span v-if="blog.publishedAt">{{ formatDate(blog.publishedAt) }}</span>
            <span
              class="text-neutral-300 dark:text-neutral-700"
              aria-hidden="true"
            >•</span>
            <span>{{ readingMinutes }} dk okuma</span>
            <button
              type="button"
              class="ml-1 inline-flex min-h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 font-semibold text-neutral-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              @click="shareArticle"
            >
              <UIcon
                name="i-lucide-share-2"
                class="size-4"
              />
              Paylaş
            </button>
          </div>
        </div>
      </header>

      <div
        v-if="blog.coverImage"
        class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div class="relative flex h-[clamp(20rem,55vw,34rem)] items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <img
              src="/images/blog-fallback.jpg"
              alt=""
              aria-hidden="true"
              class="h-full w-full object-cover"
              width="1280"
              height="720"
              loading="eager"
              decoding="async"
            >
            <ClientOnly>
              <img
                v-if="blog.coverImage && !coverImageFailed"
                ref="coverImageRef"
                :src="getOptimizedImageUrl(blog.coverImage, { width: 1280, quality: 82, fit: 'max' })"
                :srcset="coverImageSrcSet"
                sizes="(min-width: 1152px) 1152px, 100vw"
                :alt="blog.title"
                class="absolute inset-0 size-full bg-neutral-100 object-contain transition-opacity duration-300 dark:bg-neutral-900"
                :class="coverImageLoaded ? 'opacity-100' : 'opacity-0'"
                width="1280"
                height="720"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                @load="coverImageLoaded = true"
                @error="handleCoverImageError"
              >
            </ClientOnly>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-3xl px-4 py-11 sm:px-6 sm:py-16 lg:px-8">
        <!-- Backend sanitizes this HTML before it reaches the renderer. -->
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="blog-content text-neutral-700 dark:text-neutral-300"
          v-html="blog.content"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </article>

    <section
      v-if="relatedBlogs.length"
      class="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40"
    >
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              <span class="h-px w-6 bg-primary/60" />
              Okumaya devam et
            </p>
            <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Benzer yazılar
            </h2>
          </div>
          <UButton
            to="/blogs"
            label="Tümü"
            trailing
            icon="i-lucide-arrow-right"
            variant="ghost"
            color="neutral"
          />
        </div>
        <div class="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <BlogCard
            v-for="item in relatedBlogs"
            :key="item.id"
            :blog="item"
          />
        </div>
      </div>
    </section>
  </div>
</template>
