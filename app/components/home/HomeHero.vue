<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { SITE_DESCRIPTION, SITE_NAME } from '~/utils/site'

defineProps<{
  featuredBlog?: Blog | null
  loading?: boolean
}>()

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/hero-768.webp',
      type: 'image/webp',
      media: '(max-width: 768px)',
      fetchpriority: 'high'
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/images/hero-1280.webp',
      type: 'image/webp',
      media: '(min-width: 769px)',
      fetchpriority: 'high'
    }
  ]
})
</script>

<template>
  <section class="relative min-h-[clamp(31rem,72svh,40rem)] overflow-hidden bg-neutral-900 text-white">
    <img
      src="/images/hero-1280.webp"
      srcset="/images/hero-768.webp 768w, /images/hero-1280.webp 1280w, /images/hero-1600.webp 1600w"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      width="1600"
      height="900"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 size-full scale-[1.015] object-cover object-center"
    >
    <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/35" />
    <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/20" />
    <div class="absolute -right-28 top-12 size-[28rem] rounded-full bg-primary/10 blur-3xl" />

    <div class="relative mx-auto flex min-h-[clamp(31rem,72svh,40rem)] max-w-6xl flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
          <span class="size-1.5 rounded-full bg-primary" />
          Kişisel blog
        </div>

        <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ SITE_NAME }}
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {{ SITE_DESCRIPTION }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <UButton
            to="/blogs"
            size="lg"
            color="primary"
            icon="i-lucide-book-open"
            label="Yazıları Oku"
            class="bg-violet-700 text-white hover:bg-violet-600"
          />
          <UButton
            to="/hakkimda"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-user"
            label="Hakkımda"
            class="border-white/30 bg-white/[0.04] text-white hover:bg-white/10"
          />
        </div>
      </div>

      <NuxtLink
        v-if="featuredBlog"
        :to="`/blogs/${featuredBlog.slug}`"
        class="group mt-12 flex max-w-3xl items-end justify-between gap-6 rounded-xl border border-white/15 bg-black/15 p-5 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:bg-white/[0.07] sm:p-6"
      >
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
            Öne çıkan yazı
          </p>
          <p class="mt-2 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {{ featuredBlog.title }}
          </p>
          <p
            v-if="featuredBlog.excerpt"
            class="mt-2 line-clamp-2 text-sm leading-relaxed text-white/65"
          >
            {{ featuredBlog.excerpt }}
          </p>
        </div>
        <span class="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] transition group-hover:border-white/30 group-hover:bg-white/10">
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </NuxtLink>

      <div
        v-else-if="loading"
        class="mt-12 max-w-3xl rounded-xl border border-white/15 bg-black/15 p-5 backdrop-blur-sm sm:p-6"
      >
        <div class="h-4 w-28 animate-pulse rounded bg-white/20" />
        <div class="mt-3 h-7 w-2/3 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  </section>
</template>
