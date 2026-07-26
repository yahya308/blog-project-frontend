<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_NAME, SOCIAL_LINKS } from '~/utils/site'

const currentYear = new Date().getFullYear()

const footerLinks = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Tüm Yazılar', to: '/blogs' },
  { label: 'Hakkımda', to: '/hakkimda' }
]
</script>

<template>
  <footer class="mt-auto border-t border-neutral-200 bg-[#f8f8f6] dark:border-neutral-800 dark:bg-neutral-950">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
      <div>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-3 font-bold text-neutral-950 dark:text-white"
        >
          <AppMark />
          {{ SITE_NAME }}
        </NuxtLink>
        <p class="mt-4 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {{ SITE_DESCRIPTION }}
        </p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
          Keşfet
        </p>
        <nav class="mt-4 flex flex-col items-start gap-3">
          <NuxtLink
            v-for="link in footerLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-neutral-600 transition hover:text-primary dark:text-neutral-300"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
          Bağlantılar
        </p>
        <div class="mt-4 flex flex-col items-start gap-3">
          <a
            v-for="social in SOCIAL_LINKS"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-primary dark:text-neutral-300"
          >
            <UIcon
              :name="social.icon"
              class="size-4"
            />
            {{ social.label }}
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-neutral-200 dark:border-neutral-800">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>&copy; {{ currentYear }} {{ SITE_NAME }}. Tüm hakları saklıdır.</p>
        <p>İstanbul’dan düşünceler, notlar ve rotalar.</p>
      </div>
    </div>
  </footer>
</template>
