<script setup lang="ts">
import type { Blog } from '~/types/blog'

const props = defineProps<{
  blogs: Blog[]
  loading?: boolean
  error?: boolean
}>()

defineEmits<{
  retry: []
}>()

const primaryBlog = computed(() => props.blogs[0] ?? null)
const secondaryBlogs = computed(() => props.blogs.slice(1, 3))
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          Güncel
        </p>
        <h2 class="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
          Son Yazılar
        </h2>
        <p class="mt-3 max-w-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
          Son dönemde öğrendiklerim, denediklerim ve not aldığım şeyler.
        </p>
      </div>
      <UButton
        to="/blogs"
        variant="ghost"
        color="neutral"
        trailing
        icon="i-lucide-arrow-right"
        label="Tüm Yazılar"
      />
    </div>

    <div
      v-if="loading"
      class="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-14"
    >
      <div class="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <div class="aspect-[16/9] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        <div class="mt-5 h-9 w-4/5 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        <div class="mt-3 h-4 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div>
        <div
          v-for="index in 2"
          :key="index"
          class="grid gap-5 border-t border-neutral-200 py-5 sm:grid-cols-[10rem_1fr] dark:border-neutral-800"
        >
          <div class="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div>
            <div class="h-5 w-24 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div class="mt-3 h-7 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div class="mt-3 h-4 w-3/4 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center border-y border-red-300 bg-red-50/50 px-6 py-16 text-center dark:border-red-800/60 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-wifi-off"
        class="mb-4 size-10 text-red-400"
      />
      <h3 class="font-display text-2xl font-semibold text-neutral-950 dark:text-white">
        Yazılar yüklenemedi
      </h3>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Bir sorun oluştu. Lütfen tekrar deneyin.
      </p>
      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        label="Tekrar Dene"
        variant="soft"
        @click="$emit('retry')"
      />
    </div>

    <div
      v-else-if="blogs.length === 0"
      class="flex flex-col items-center justify-center border-y border-neutral-300 px-6 py-16 text-center dark:border-neutral-700"
    >
      <UIcon
        name="i-lucide-file-text"
        class="mb-4 size-10 text-neutral-400"
      />
      <h3 class="font-display text-2xl font-semibold text-neutral-950 dark:text-white">
        Henüz yayınlanmış yazı yok
      </h3>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        İlk yazı yayınlandığında burada görünecek.
      </p>
    </div>

    <div
      v-else
      class="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-14"
    >
      <BlogCard
        v-if="primaryBlog"
        :blog="primaryBlog"
        variant="featured"
      />
      <div>
        <BlogCard
          v-for="blog in secondaryBlogs"
          :key="blog.id"
          :blog="blog"
          variant="compact"
        />
      </div>
    </div>
  </section>
</template>
