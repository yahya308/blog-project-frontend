<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { SITE_DESCRIPTION, SITE_NAME } from '~/utils/site'

defineProps<{
  featuredBlog?: Blog | null
  loading?: boolean
}>()
</script>

<template>
  <section class="relative min-h-[clamp(30rem,70svh,38rem)] overflow-hidden bg-neutral-900 text-white">
    <img
      src="/images/hero-fallback.jpg"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      width="1600"
      height="900"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 size-full object-cover object-center"
    >
    <div class="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/80 to-neutral-950/35" />
    <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/65 via-transparent to-neutral-950/15" />

    <div class="relative mx-auto flex min-h-[clamp(30rem,70svh,38rem)] max-w-6xl flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-wider text-white/70">
          Kişisel blog
        </p>
        <h1 class="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
          {{ SITE_NAME }}
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {{ SITE_DESCRIPTION }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <UButton
            to="/blogs"
            size="lg"
            color="neutral"
            icon="i-lucide-book-open"
            label="Yazıları Oku"
          />
          <UButton
            to="/hakkimda"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-user"
            label="Hakkımda"
            class="border-white/40 bg-black/10 text-white hover:bg-white/10"
          />
        </div>
      </div>

      <NuxtLink
        v-if="featuredBlog"
        :to="`/blogs/${featuredBlog.slug}`"
        class="mt-12 flex max-w-3xl items-end justify-between gap-6 border-t border-white/30 pt-5 transition hover:border-white/60"
      >
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-white/60">
            Öne çıkan yazı
          </p>
          <p class="mt-2 text-lg font-semibold sm:text-xl">
            {{ featuredBlog.title }}
          </p>
          <p
            v-if="featuredBlog.excerpt"
            class="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70"
          >
            {{ featuredBlog.excerpt }}
          </p>
        </div>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="mb-1 size-6 shrink-0"
        />
      </NuxtLink>

      <div
        v-else-if="loading"
        class="mt-12 max-w-3xl border-t border-white/30 pt-5"
      >
        <div class="h-4 w-28 animate-pulse rounded bg-white/20" />
        <div class="mt-3 h-7 w-2/3 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  </section>
</template>
