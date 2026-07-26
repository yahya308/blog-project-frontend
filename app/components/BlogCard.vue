<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getReadingMinutes } from '~/utils/blog'
import { getImageSrcSet, getOptimizedImageUrl } from '~/utils/image'

const props = withDefaults(defineProps<{
  blog: Blog
  variant?: 'default' | 'featured' | 'compact'
}>(), {
  variant: 'default'
})

const imageError = ref(false)
const imageLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)
const readingMinutes = computed(() => getReadingMinutes(props.blog.content))

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
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}
</script>

<template>
  <article
    v-if="variant === 'compact'"
    class="group grid gap-5 border-t border-neutral-200 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] dark:border-neutral-800"
  >
    <NuxtLink
      :to="`/blogs/${blog.slug}`"
      class="relative block overflow-hidden bg-neutral-200 dark:bg-neutral-800"
      :aria-label="`${blog.title} yazısını aç`"
    >
      <img
        src="/images/blog-fallback.jpg"
        alt=""
        aria-hidden="true"
        class="aspect-[4/3] size-full object-cover"
        width="480"
        height="360"
        loading="lazy"
        decoding="async"
      >
      <ClientOnly>
        <img
          v-if="blog.coverImage && !imageError"
          ref="imageRef"
          :src="getOptimizedImageUrl(blog.coverImage, { width: 480, quality: 74 })"
          :srcset="getImageSrcSet(blog.coverImage, [320, 480], { quality: 74 })"
          sizes="160px"
          :alt="blog.title"
          class="absolute inset-0 size-full object-cover transition duration-700"
          :class="imageLoaded ? 'opacity-100 group-hover:scale-[1.04]' : 'opacity-0'"
          width="480"
          height="360"
          loading="lazy"
          decoding="async"
          @load="imageLoaded = true"
          @error="imageError = true"
        >
      </ClientOnly>
    </NuxtLink>

    <div class="flex min-w-0 flex-col justify-center">
      <p
        v-if="blog.categories?.length"
        class="text-xs font-bold uppercase tracking-[0.14em] text-primary"
      >
        {{ blog.categories[0]?.name }}
      </p>
      <NuxtLink :to="`/blogs/${blog.slug}`">
        <h3 class="mt-2 font-display text-xl font-semibold leading-tight tracking-tight text-neutral-950 transition group-hover:text-primary sm:text-2xl dark:text-white">
          {{ blog.title }}
        </h3>
      </NuxtLink>
      <p
        v-if="blog.excerpt"
        class="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
      >
        {{ blog.excerpt }}
      </p>
      <p class="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-500">
        <span v-if="blog.publishedAt">{{ formatDate(blog.publishedAt) }}</span>
        <span v-if="blog.publishedAt" aria-hidden="true"> · </span>
        <span>{{ readingMinutes }} dk okuma</span>
      </p>
    </div>
  </article>

  <article
    v-else
    class="group flex h-full flex-col border-t border-neutral-200 pt-5 dark:border-neutral-800"
  >
    <NuxtLink
      :to="`/blogs/${blog.slug}`"
      class="relative block overflow-hidden bg-neutral-200 dark:bg-neutral-800"
      :aria-label="`${blog.title} yazısını aç`"
    >
      <img
        src="/images/blog-fallback.jpg"
        alt=""
        aria-hidden="true"
        :class="variant === 'featured' ? 'aspect-[16/9]' : 'aspect-[16/10]'"
        class="w-full object-cover"
        width="960"
        height="600"
        loading="lazy"
        decoding="async"
      >
      <ClientOnly>
        <img
          v-if="blog.coverImage && !imageError"
          ref="imageRef"
          :src="getOptimizedImageUrl(blog.coverImage, { width: variant === 'featured' ? 960 : 720, quality: 76 })"
          :srcset="getImageSrcSet(blog.coverImage, variant === 'featured' ? [480, 720, 960] : [360, 540, 720], { quality: 76 })"
          :sizes="variant === 'featured' ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw'"
          :alt="blog.title"
          class="absolute inset-0 size-full object-cover transition duration-700"
          :class="imageLoaded ? 'opacity-100 group-hover:scale-[1.035]' : 'opacity-0'"
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
          @load="imageLoaded = true"
          @error="imageError = true"
        >
      </ClientOnly>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </NuxtLink>

    <div class="flex flex-1 flex-col pt-5">
      <div
        v-if="blog.categories?.length"
        class="flex flex-wrap gap-x-3 gap-y-1"
      >
        <span
          v-for="category in blog.categories.slice(0, 2)"
          :key="category.id"
          class="text-xs font-bold uppercase tracking-[0.14em] text-primary"
        >
          {{ category.name }}
        </span>
      </div>

      <NuxtLink
        :to="`/blogs/${blog.slug}`"
        class="block"
      >
        <h2
          class="mt-3 font-display font-semibold leading-[1.08] tracking-tight text-neutral-950 transition group-hover:text-primary dark:text-white"
          :class="variant === 'featured' ? 'text-3xl sm:text-4xl' : 'text-2xl'"
        >
          {{ blog.title }}
        </h2>
      </NuxtLink>

      <p
        v-if="blog.excerpt"
        class="mt-3 line-clamp-3 flex-1 leading-relaxed text-neutral-600 dark:text-neutral-400"
        :class="variant === 'featured' ? 'text-base sm:text-lg' : 'text-sm'"
      >
        {{ blog.excerpt }}
      </p>

      <div class="mt-5 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-500">
        <span v-if="blog.publishedAt">{{ formatDate(blog.publishedAt) }}</span>
        <span v-if="blog.publishedAt" aria-hidden="true">·</span>
        <span>{{ readingMinutes }} dk okuma</span>
      </div>
    </div>
  </article>
</template>
