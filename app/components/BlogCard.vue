<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getBlogAuthorName } from '~/utils/blog'
import { getImageSrcSet, getOptimizedImageUrl } from '~/utils/image'

const props = defineProps<{
  blog: Blog
}>()

const authorName = computed(() => getBlogAuthorName(props.blog))
const imageError = ref(false)
const imageLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

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
    class="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700"
  >
    <NuxtLink
      :to="`/blogs/${blog.slug}`"
      class="relative block overflow-hidden"
      :aria-label="`${blog.title} yazısını aç`"
    >
      <img
        src="/images/blog-fallback.jpg"
        alt=""
        aria-hidden="true"
        class="aspect-[16/10] w-full object-cover"
        width="720"
        height="450"
        loading="lazy"
        decoding="async"
      >
      <ClientOnly>
        <img
          v-if="blog.coverImage && !imageError"
          ref="imageRef"
          :src="getOptimizedImageUrl(blog.coverImage, { width: 720, quality: 74 })"
          :srcset="getImageSrcSet(blog.coverImage, [360, 540, 720], { quality: 74 })"
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
          :alt="blog.title"
          class="absolute inset-0 size-full object-cover transition duration-700"
          :class="imageLoaded
            ? 'opacity-100 group-hover:scale-[1.04]'
            : 'opacity-0'"
          width="720"
          height="450"
          loading="lazy"
          decoding="async"
          @load="imageLoaded = true"
          @error="imageError = true"
        >
      </ClientOnly>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </NuxtLink>

    <div class="flex flex-1 flex-col p-5">
      <div
        v-if="blog.categories?.length"
        class="mb-3 flex flex-wrap gap-2"
      >
        <span
          v-for="category in blog.categories"
          :key="category.id"
          class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        >
          {{ category.name }}
        </span>
      </div>

      <NuxtLink
        :to="`/blogs/${blog.slug}`"
        class="block"
      >
        <h2 class="text-lg font-semibold leading-snug tracking-tight text-neutral-900 transition group-hover:text-primary dark:text-white">
          {{ blog.title }}
        </h2>
      </NuxtLink>

      <p
        v-if="blog.excerpt"
        class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
      >
        {{ blog.excerpt }}
      </p>

      <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 text-sm text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <span v-if="authorName">
          {{ authorName }}
        </span>
        <span v-if="blog.publishedAt">
          {{ formatDate(blog.publishedAt) }}
        </span>
      </div>
    </div>
  </article>
</template>
