<script setup lang="ts">
interface HomeCategory {
  id: string
  name: string
  count: number
}

defineProps<{
  categories: HomeCategory[]
}>()
</script>

<template>
  <section
    v-if="categories.length"
    class="border-y border-neutral-200/80 bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/40"
  >
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div>
          <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-violet-800 dark:text-violet-300">
            <span class="h-px w-6 bg-violet-700/70 dark:bg-violet-300/70" />
            Konular
          </p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            İlgi alanına göre keşfet
          </h2>
          <p class="mt-3 max-w-md leading-relaxed text-neutral-600 dark:text-neutral-400">
            Teknolojiden seyahate, yaşam notlarından kişisel deneyimlere uzanan yazılar.
          </p>
        </div>

        <div class="grid sm:grid-cols-2">
          <NuxtLink
            v-for="(category, index) in categories"
            :key="category.id"
            :to="{ path: '/blogs', query: { category: category.id } }"
            class="group -mx-3 flex min-h-20 items-center justify-between gap-4 border-t border-neutral-200 px-3 py-5 transition-colors hover:bg-white/70 dark:border-neutral-800 dark:hover:bg-neutral-900/80 sm:mx-0"
            :class="[
              index === 0 ? 'border-t-0' : '',
              index === 1 ? 'sm:border-t-0' : '',
              index % 2 === 0 ? 'sm:pr-6' : 'sm:border-l sm:pl-6'
            ]"
          >
            <div>
              <p class="font-semibold text-neutral-950 transition-colors group-hover:text-primary dark:text-white">
                {{ category.name }}
              </p>
              <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {{ category.count }} yazı
              </p>
            </div>
            <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary dark:border-neutral-800 dark:bg-neutral-950">
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
