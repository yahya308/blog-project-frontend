<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getImageSrcSet, getOptimizedImageUrl } from '~/utils/image'

const props = defineProps<{
  blog: Blog
}>()

const imageError = ref(false)
const imageLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

const readingMinutes = computed(() => {
  const plainText = props.blog.content?.replace(/<[^>]*>/g, ' ') ?? ''
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

watch(() => props.blog.coverImage, () => {
  imageError.value = false
  imageLoaded.value = false
  nextTick(checkImage)
})

onMounted(() => {
  nextTick(checkImage)
})

function checkImage() {
  const image = imageRef.value
  if (!image?.complete) {
    return
  }

  imageError.value = image.naturalWidth === 0
  imageLoaded.value = image.naturalWidth > 0
}

function formatDate(value?: string | null) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}
</script>

<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-950/5 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/20"
  >
    <NuxtLink
      :to="`/blogs/${blog.slug}`"
      class="relative block overflow-hidden bg-neutral-100 dark:bg-neutral-800"
      :aria-label="`${blog.title} yazısını aç`"
    >
      <img
        src="/images/blog-fallback.jpg"
        alt=""
        aria-hidden="true"
        class="aspect-[16/9] w-full object-cover"
        width="720"
        height="405"
        loading="lazy"
        decoding="async"
      >
      <ClientOnly>
        <img
          v-if="blog.coverImage && !imageError"
          ref="imageRef"
          :src="getOptimizedImageUrl(blog.coverImage, { width: 720, quality: 76 })"
          :srcset="getImageSrcSet(blog.coverImage, [360, 540, 720], { quality: 76 })"
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
          :alt="blog.title"
          class="absolute inset-0 size-full object-cover transition duration-700 ease-out"
          :class="imageLoaded
            ? 'opacity-100 group-hover:scale-[1.035]'
            : 'opacity-0'"
          width="720"
          height="405"
          loading="lazy"
          decoding="async"
          @load="imageLoaded = true"
          @error="imageError = true"
        >
      </ClientOnly>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </NuxtLink>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div
        v-if="blog.categories?.length"
        class="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        <template
          v-for="(category, index) in blog.categories"
          :key="category.id"
        >
          <span
            v-if="index > 0"
            class="size-1 rounded-full bg-neutral-300 dark:bg-neutral-700"
            aria-hidden="true"
          />
          <span
            class="text-xs font-semibold uppercase tracking-[0.12em]"
            :class="index === 0 ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'"
          >
            {{ category.name }}
          </span>
        </template>
      </div>

      <NuxtLink
        :to="`/blogs/${blog.slug}`"
        class="block"
      >
        <h2 class="text-xl font-semibold leading-snug tracking-tight text-neutral-950 transition group-hover:text-primary dark:text-white">
          {{ blog.title }}
        </h2>
      </NuxtLink>

      <p
        v-if="blog.excerpt"
        class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
      >
        {{ blog.excerpt }}
      </p>

      <div class="mt-6 flex items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 text-sm text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <span v-if="blog.publishedAt">
          {{ formatDate(blog.publishedAt) }}
        </span>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <UIcon
            name="i-lucide-clock-3"
            class="size-3.5"
          />
          {{ readingMinutes }} dk
        </span>
      </div>
    </div>
  </article>
</template>
