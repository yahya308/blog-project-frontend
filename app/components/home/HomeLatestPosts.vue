<script setup lang="ts">
import type { Blog } from '~/types/blog'

defineProps<{
  blogs: Blog[]
  loading?: boolean
  error?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-violet-800 dark:text-violet-300">
          <span class="h-px w-6 bg-violet-700/70 dark:bg-violet-300/70" />
          Güncel
        </p>
        <h2 class="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
          Son Yazılar
        </h2>
        <p class="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
          Öne çıkan yazının ardından en yeni notlar ve rotalar.
        </p>
      </div>
      <UButton
        to="/blogs"
        variant="outline"
        color="neutral"
        trailing
        icon="i-lucide-arrow-right"
        label="Tüm Yazılar"
      />
    </div>

    <div
      v-if="loading"
      class="grid gap-7 lg:grid-cols-3"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-neutral-800/80"
      >
        <div class="aspect-video animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        <div class="space-y-3 p-6">
          <div class="flex gap-2">
            <div class="h-5 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div class="h-6 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div class="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div class="mt-4 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
            <div class="flex justify-between">
              <div class="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div class="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-300 bg-red-50/50 px-6 py-16 text-center dark:border-red-800/60 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-wifi-off"
        class="mb-4 size-10 text-red-400"
      />
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
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
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700"
    >
      <UIcon
        name="i-lucide-file-text"
        class="mb-4 size-10 text-neutral-400"
      />
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
        Henüz yayınlanmış yazı yok
      </h3>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        İlk yazı yayınlandığında burada görünecek.
      </p>
    </div>

    <div
      v-else
      class="grid gap-7 lg:grid-cols-3"
    >
      <BlogCard
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
      />
    </div>
  </section>
</template>
