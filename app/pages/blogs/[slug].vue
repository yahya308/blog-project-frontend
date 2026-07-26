<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getBlogAuthorName, getReadingMinutes } from '~/utils/blog'
import { getImageSrcSet, getOptimizedImageUrl } from '~/utils/image'
import { slugify } from '~/utils/slugify'

interface TocItem {
  id: string
  title: string
  level: 2 | 3
}

const route = useRoute()
const toast = useToast()
const { getPublishedBlogBySlug, getPublishedBlogs } = useBlogsApi()
const blogSlug = computed(() => String(route.params.slug))
const articleRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const coverImageRef = ref<HTMLImageElement | null>(null)
const readingProgress = ref(0)
const coverImageFailed = ref(false)
const coverImageLoaded = ref(false)
const tocItems = ref<TocItem[]>([])
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
const readingMinutes = computed(() => getReadingMinutes(blog.value?.content))

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

watch(() => blog.value?.content, async () => {
  await nextTick()
  enhanceArticleContent()
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

function getCodeLabel(pre: HTMLPreElement) {
  const code = pre.querySelector('code')
  const filename = pre.dataset.filename || code?.dataset.filename
  if (filename) return filename

  const languageClass = Array.from(code?.classList ?? [])
    .find(className => className.startsWith('language-'))

  return languageClass?.replace('language-', '') || 'Kod'
}

function enhanceArticleContent() {
  const content = contentRef.value
  if (!content) return

  const usedIds = new Set<string>()
  const headings = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3'))

  tocItems.value = headings
    .map((heading, index) => {
      const title = heading.textContent?.trim() || `Bölüm ${index + 1}`
      const baseId = heading.id || slugify(title) || `bolum-${index + 1}`
      let id = baseId
      let suffix = 2

      while (usedIds.has(id)) {
        id = `${baseId}-${suffix}`
        suffix += 1
      }

      usedIds.add(id)
      heading.id = id

      return {
        id,
        title,
        level: heading.tagName === 'H3' ? 3 : 2
      } satisfies TocItem
    })

  const codeBlocks = Array.from(content.querySelectorAll<HTMLPreElement>('pre'))

  for (const pre of codeBlocks) {
    if (pre.closest('.blog-code-block')) continue

    const parent = pre.parentElement
    if (!parent) continue

    const wrapper = document.createElement('div')
    wrapper.className = 'blog-code-block'

    const toolbar = document.createElement('div')
    toolbar.className = 'blog-code-toolbar'

    const label = document.createElement('span')
    label.className = 'blog-code-label'
    label.textContent = getCodeLabel(pre)

    const copyButton = document.createElement('button')
    copyButton.type = 'button'
    copyButton.className = 'blog-code-copy'
    copyButton.textContent = 'Kopyala'
    copyButton.setAttribute('aria-label', 'Kod bloğunu kopyala')

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent || '')
        copyButton.textContent = 'Kopyalandı'
        window.setTimeout(() => {
          copyButton.textContent = 'Kopyala'
        }, 1600)
      } catch {
        toast.add({ title: 'Kod kopyalanamadı', color: 'error' })
      }
    })

    toolbar.append(label, copyButton)
    parent.insertBefore(wrapper, pre)
    wrapper.append(toolbar, pre)
  }
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
  nextTick(() => {
    checkCoverImage()
    enhanceArticleContent()
  })
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
      <div class="h-4 w-32 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-8 h-12 w-full max-w-2xl animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-5 h-6 w-2/3 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div class="mt-10 aspect-[16/9] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
    </div>

    <div
      v-else-if="notFound || !blog"
      class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <UIcon
        name="i-lucide-file-question"
        class="size-10 text-neutral-400"
      />
      <h1 class="mt-5 font-display text-3xl font-semibold">
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
      <header class="border-b border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
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
            class="mt-7 flex flex-wrap gap-x-4 gap-y-2"
          >
            <NuxtLink
              v-for="category in blog.categories"
              :key="category.id"
              :to="{ path: '/blogs', query: { category: category.slug } }"
              class="text-xs font-bold uppercase tracking-[0.16em] text-primary transition hover:text-primary/70"
            >
              {{ category.name }}
            </NuxtLink>
          </div>

          <h1 class="mt-5 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.1rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-neutral-950 dark:text-white">
            {{ blog.title }}
          </h1>

          <p
            v-if="blog.excerpt"
            class="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300"
          >
            {{ blog.excerpt }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-neutral-300 pt-5 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <span
              v-if="authorName"
              class="font-semibold text-neutral-800 dark:text-neutral-200"
            >
              {{ authorName }}
            </span>
            <span v-if="blog.publishedAt">{{ formatDate(blog.publishedAt) }}</span>
            <span>{{ readingMinutes }} dk okuma</span>
            <button
              type="button"
              class="ml-auto inline-flex min-h-11 items-center gap-2 font-semibold text-neutral-600 transition hover:text-primary dark:text-neutral-300"
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
        class="border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="relative mx-auto flex h-[clamp(20rem,55vw,36rem)] max-w-6xl items-center justify-center overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
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

      <div class="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_14rem] lg:px-8 lg:py-20">
        <div class="min-w-0 lg:max-w-3xl">
          <!-- Backend sanitizes this HTML before it reaches the renderer. -->
          <!-- eslint-disable vue/no-v-html -->
          <div
            ref="contentRef"
            class="blog-content text-[1.0625rem] leading-8 text-neutral-700 dark:text-neutral-300"
            v-html="blog.content"
          />
          <!-- eslint-enable vue/no-v-html -->
        </div>

        <aside
          v-if="tocItems.length >= 2"
          class="hidden lg:block"
          aria-label="İçindekiler"
        >
          <div class="sticky top-28 border-l border-neutral-300 pl-5 dark:border-neutral-700">
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
              İçindekiler
            </p>
            <nav class="mt-4 space-y-3">
              <a
                v-for="item in tocItems"
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-sm leading-snug text-neutral-500 transition hover:text-primary dark:text-neutral-400"
                :class="item.level === 3 ? 'pl-3 text-xs' : 'font-medium'"
              >
                {{ item.title }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </article>

    <section
      v-if="relatedBlogs.length"
      class="border-t border-neutral-200 bg-white/45 dark:border-neutral-800 dark:bg-neutral-900/30"
    >
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              Okumaya devam et
            </p>
            <h2 class="mt-3 font-display text-4xl font-semibold sm:text-5xl">
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
        <div class="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
