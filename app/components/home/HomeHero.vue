<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { getReadingMinutes } from '~/utils/blog'
import { SITE_NAME } from '~/utils/site'

const props = defineProps<{
  featuredBlog?: Blog | null
  loading?: boolean
}>()

const featuredReadingMinutes = computed(() =>
  props.featuredBlog ? getReadingMinutes(props.featuredBlog.content) : null
)

function formatDate(value?: string | null) {
  if (!value) return ''

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}
</script>

<template>
  <section class="border-b border-neutral-200 dark:border-neutral-800">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16">
        <div>
          <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            <span class="size-2 rounded-full bg-primary" />
            Kişisel blog · İstanbul
          </div>

          <h1 class="mt-6 max-w-4xl font-display text-[clamp(3.6rem,8vw,6.8rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-neutral-950 dark:text-white">
            {{ SITE_NAME }}<span class="text-primary">.</span>
          </h1>

          <p class="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Yazılım, mühendislik ve hayat üzerine öğrendiklerimi kaydettiğim dijital defter.
            Teknik notlar, kişisel deneyimler ve yeni rotalar aynı yerde.
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-3">
            <UButton
              to="/blogs"
              size="lg"
              icon="i-lucide-arrow-right"
              trailing
              label="Yazıları Keşfet"
            />
            <UButton
              to="/hakkimda"
              size="lg"
              color="neutral"
              variant="ghost"
              icon="i-lucide-user-round"
              label="Hakkımda"
            />
          </div>
        </div>

        <div class="editorial-grid relative min-h-[23rem] overflow-hidden border border-neutral-300 bg-neutral-950 p-6 text-white shadow-[12px_12px_0_rgba(124,58,237,0.12)] dark:border-neutral-700 sm:min-h-[27rem] sm:p-8">
          <div class="relative z-10 flex h-full min-h-[19rem] flex-col justify-between sm:min-h-[23rem]">
            <div class="flex items-start justify-between gap-4 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              <span>YB / 2026</span>
              <span>Build · Write · Explore</span>
            </div>

            <div>
              <p class="font-display text-[clamp(7rem,18vw,11rem)] font-semibold leading-[0.72] tracking-[-0.09em] text-white">
                YB<span class="text-primary">.</span>
              </p>
              <p class="mt-8 max-w-sm text-sm leading-relaxed text-white/60">
                Kod yazmak, bir şeyler öğrenmek ve bunları geriye dönüp bakabileceğim notlara dönüştürmek için.
              </p>
            </div>

            <div class="grid grid-cols-3 border-t border-white/15 pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              <span>01 Kod</span>
              <span>02 Notlar</span>
              <span class="text-right">03 Rotalar</span>
            </div>
          </div>
          <div class="absolute -right-12 top-20 size-44 rounded-full border border-primary/50" />
          <div class="absolute -right-4 top-28 size-28 rounded-full border border-white/10" />
        </div>
      </div>

      <NuxtLink
        v-if="featuredBlog"
        :to="`/blogs/${featuredBlog.slug}`"
        class="group mt-14 grid gap-5 border-y border-neutral-300 py-6 transition hover:border-neutral-500 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center dark:border-neutral-700 dark:hover:border-neutral-500"
      >
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Öne çıkan
          </p>
          <p class="mt-2 text-xs font-medium text-neutral-500">
            <span v-if="featuredBlog.publishedAt">{{ formatDate(featuredBlog.publishedAt) }}</span>
            <span v-if="featuredBlog.publishedAt" aria-hidden="true"> · </span>
            <span>{{ featuredReadingMinutes }} dk</span>
          </p>
        </div>
        <div class="min-w-0">
          <h2 class="font-display text-2xl font-semibold leading-tight tracking-tight text-neutral-950 transition group-hover:text-primary sm:text-3xl dark:text-white">
            {{ featuredBlog.title }}
          </h2>
          <p
            v-if="featuredBlog.excerpt"
            class="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {{ featuredBlog.excerpt }}
          </p>
        </div>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="size-6 text-neutral-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
        />
      </NuxtLink>

      <div
        v-else-if="loading"
        class="mt-14 grid gap-5 border-y border-neutral-300 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] dark:border-neutral-700"
      >
        <div class="h-4 w-24 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        <div>
          <div class="h-8 w-2/3 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div class="mt-3 h-4 w-full max-w-2xl animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  </section>
</template>
