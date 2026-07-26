<script setup lang="ts">
import { SITE_NAME, SOCIAL_LINKS } from '~/utils/site'
</script>

<template>
  <section class="relative overflow-hidden border-t border-neutral-800 bg-neutral-950 text-white">
    <div class="pointer-events-none absolute -right-32 top-1/2 size-96 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
    <div class="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
      <div>
        <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
          <span class="h-px w-6 bg-primary/70" />
          Yazar hakkında
        </p>
        <h2 class="mt-4 text-3xl font-bold tracking-tight">
          Merhaba, ben {{ SITE_NAME }}.
        </h2>
      </div>

      <div>
        <p class="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          İstanbul’da bilgisayar mühendisliği okuyorum. Burada teknoloji notlarımı,
          seyahat rotalarımı, alışkanlıklarımı ve hayata dair kendi deneyimlerimi paylaşıyorum.
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-3">
          <UButton
            to="/hakkimda"
            color="primary"
            icon="i-lucide-user-round"
            label="Daha Yakından Tanı"
          />
          <UButton
            v-for="social in SOCIAL_LINKS"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            :icon="social.icon"
            :aria-label="social.label"
            class="border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
          />
        </div>
      </div>
    </div>
  </section>
</template>
