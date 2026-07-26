<script setup lang="ts">
import { SITE_NAME, SOCIAL_LINKS } from '~/utils/site'
</script>

<template>
  <section class="border-t border-neutral-800 bg-neutral-950 text-white">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-20">
      <div class="flex items-start gap-5">
        <div class="flex size-20 shrink-0 items-center justify-center border border-white/15 bg-white/5 sm:size-24">
          <span class="font-display text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">YB<span class="text-primary">.</span></span>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
            Yazar hakkında
          </p>
          <p class="mt-2 text-sm leading-relaxed text-white/55">
            İstanbul · Bilgisayar Mühendisliği
          </p>
        </div>
      </div>

      <div>
        <h2 class="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Merhaba, ben {{ SITE_NAME }}.
        </h2>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          İstanbul’da bilgisayar mühendisliği okuyorum. Burada teknoloji notlarımı,
          seyahat rotalarımı, alışkanlıklarımı ve hayata dair kendi deneyimlerimi paylaşıyorum.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
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
