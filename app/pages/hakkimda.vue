<script setup lang="ts">
import { SITE_NAME, SOCIAL_LINKS } from '~/utils/site'

const aboutDescription = 'İstanbul’da bilgisayar mühendisliği okuyan Yahya’nın kişisel blogu, hedefleri ve yolculuğu.'

useSeoMeta({
  title: `Hakkımda | ${SITE_NAME}`,
  description: aboutDescription,
  ogTitle: `Hakkımda | ${SITE_NAME}`,
  ogDescription: aboutDescription
})

const facts = [
  { label: 'Konum', value: 'İstanbul', icon: 'i-lucide-map-pin' },
  { label: 'Eğitim', value: 'Bilgisayar Mühendisliği', icon: 'i-lucide-graduation-cap' },
  { label: 'Odak', value: 'Yazılım ve savunma sanayii', icon: 'i-lucide-radar' }
]

const goals = [
  {
    number: '01',
    title: 'Teknik olarak derinleşmek',
    text: 'Yazılım mühendisliği temellerini güçlendirip gerçek problemlere sağlam çözümler üretmek.'
  },
  {
    number: '02',
    title: 'Savunma sanayiinde çalışmak',
    text: 'Yüksek sorumluluk gerektiren sistemlerde, teknik kalitesi yüksek projelerin parçası olmak.'
  },
  {
    number: '03',
    title: 'İtalya’da yüksek lisans',
    text: 'Yeni bir akademik çevrede uzmanlaşırken farklı bir kültürü ve yaşam biçimini deneyimlemek.'
  }
]

const topics = [
  'Yazılım ve teknoloji notları',
  'Alışkanlıklar ve kişisel gelişim',
  'Seyahat rotaları ve deneyimler',
  'Öğrencilikten iş hayatına geçiş'
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-neutral-800 bg-neutral-950 text-white">
      <div class="pointer-events-none absolute -right-28 top-8 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div class="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          <span class="h-px w-6 bg-primary/70" />
          Hakkımda
        </p>
        <h1 class="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Selam, ben {{ SITE_NAME }}.
        </h1>
        <p class="mt-6 max-w-3xl text-lg leading-relaxed text-white/65 sm:text-xl">
          Mühendislik, merak ve yeni deneyimler arasında kendi yolunu çizen bir bilgisayar mühendisliği öğrencisiyim.
        </p>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20 lg:px-8 lg:py-20">
      <div>
        <p class="text-sm font-bold uppercase tracking-wider text-neutral-500">
          Hikâyem
        </p>
        <div class="mt-5 space-y-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          <p>
            İstanbul’da bilgisayar mühendisliği okuyorum. Üniversitenin son döneminde bir yandan teknik olarak kendimi geliştiriyor, bir yandan da mezuniyet sonrasındaki yönümü daha net hale getiriyorum.
          </p>
          <p>
            Savunma sanayii uzun vadeli hedeflerimin merkezinde. Karmaşık problemlerin, güvenilir sistemlerin ve disiplinli mühendisliğin olduğu bir ortamda çalışmak istiyorum.
          </p>
          <p>
            Bu blog ise öğrendiklerimi ve yaşadıklarımı kaybetmemek için tuttuğum açık bir not defteri. Teknoloji kadar seyahat, alışkanlıklar ve gündelik hayat da burada kendine yer buluyor.
          </p>
        </div>
      </div>

      <aside class="border-y border-neutral-200 dark:border-neutral-800 lg:border-y-0 lg:border-l lg:pl-10">
        <div
          v-for="fact in facts"
          :key="fact.label"
          class="flex gap-4 border-b border-neutral-200 py-5 last:border-b-0 dark:border-neutral-800"
        >
          <span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
            <UIcon
              :name="fact.icon"
              class="size-4"
            />
          </span>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {{ fact.label }}
            </p>
            <p class="mt-1 font-semibold text-neutral-950 dark:text-white">
              {{ fact.value }}
            </p>
          </div>
        </div>
      </aside>
    </section>

    <section class="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p class="text-sm font-bold uppercase tracking-wider text-neutral-500">
          Yol haritası
        </p>
        <h2 class="mt-3 text-3xl font-bold text-neutral-950 dark:text-white">
          Nereye gitmek istiyorum?
        </h2>

        <ol class="mt-10 grid gap-0 border-t border-neutral-200 dark:border-neutral-800 lg:grid-cols-3">
          <li
            v-for="goal in goals"
            :key="goal.number"
            class="border-b border-neutral-200 py-7 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0 dark:border-neutral-800"
          >
            <span class="text-sm font-bold text-primary">{{ goal.number }}</span>
            <h3 class="mt-4 text-xl font-bold text-neutral-950 dark:text-white">
              {{ goal.title }}
            </h3>
            <p class="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {{ goal.text }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-20">
      <div>
        <p class="text-sm font-bold uppercase tracking-wider text-neutral-500">
          Blogda ne var?
        </p>
        <h2 class="mt-3 text-3xl font-bold text-neutral-950 dark:text-white">
          Samimi ve işe yarar notlar
        </h2>
        <ul class="mt-7 border-t border-neutral-200 dark:border-neutral-800">
          <li
            v-for="topic in topics"
            :key="topic"
            class="flex items-center gap-3 border-b border-neutral-200 py-4 font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-200"
          >
            <UIcon
              name="i-lucide-check"
              class="size-4 shrink-0 text-primary"
            />
            {{ topic }}
          </li>
        </ul>
      </div>

      <div class="flex flex-col justify-center border-t border-neutral-200 pt-8 dark:border-neutral-800 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
        <p class="text-sm font-bold uppercase tracking-wider text-neutral-500">
          İletişim
        </p>
        <h2 class="mt-3 text-3xl font-bold text-neutral-950 dark:text-white">
          Bir merhaba bırak
        </h2>
        <p class="mt-4 max-w-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Yazılar, projeler veya ortak ilgi alanları hakkında konuşmak için sosyal medya hesaplarımdan ulaşabilirsin.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <UButton
            v-for="social in SOCIAL_LINKS"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            :icon="social.icon"
            :label="social.label"
          />
        </div>
        <UButton
          to="/blogs"
          class="mt-7 self-start"
          icon="i-lucide-arrow-right"
          trailing
          label="Yazıları Keşfet"
        />
      </div>
    </section>
  </div>
</template>
