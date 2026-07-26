<script setup lang="ts">
import { SITE_NAME, SOCIAL_LINKS } from '~/utils/site'
</script>

<template>
  <section class="border-t border-neutral-200/80 bg-neutral-950 text-white dark:border-neutral-800/80">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
      <div>
        <p class="text-sm font-medium uppercase tracking-wider text-white/50">
          Yazar hakkında
        </p>
        <h2 class="mt-3 text-3xl font-bold">
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
            color="neutral"
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
            variant="ghost"
            :icon="social.icon"
            :aria-label="social.label"
          />
        </div>
      </div>
    </div>
  </section>
</template>
