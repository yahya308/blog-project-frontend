<script setup lang="ts">
interface HomeCategory {
  id: string
  name: string
  slug: string
  count: number
}

defineProps<{
  categories: HomeCategory[]
}>()
</script>

<template>
  <section
    v-if="categories.length"
    class="border-y border-neutral-200/80 bg-white/55 dark:border-neutral-800/80 dark:bg-neutral-900/30"
  >
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Konular
          </p>
          <h2 class="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
            İlgi alanına göre keşfet
          </h2>
          <p class="mt-4 max-w-md leading-relaxed text-neutral-600 dark:text-neutral-400">
            Teknolojiden seyahate, yaşam notlarından kişisel deneyimlere uzanan yazılar.
          </p>
        </div>

        <div class="grid sm:grid-cols-2">
          <NuxtLink
            v-for="(category, index) in categories"
            :key="category.id"
            :to="{ path: '/blogs', query: { category: category.slug } }"
            class="group flex min-h-24 items-center justify-between gap-4 border-t border-neutral-200 py-5 transition dark:border-neutral-800"
            :class="[
              index === 0 ? 'border-t-0' : '',
              index === 1 ? 'sm:border-t-0' : '',
              index % 2 === 0 ? 'sm:pr-7' : 'sm:border-l sm:pl-7'
            ]"
          >
            <div>
              <p class="font-display text-xl font-semibold text-neutral-950 transition group-hover:text-primary dark:text-white">
                {{ category.name }}
              </p>
              <p class="mt-1 text-sm text-neutral-500">
                {{ category.count }} yazı
              </p>
            </div>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
