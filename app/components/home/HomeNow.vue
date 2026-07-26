<script setup lang="ts">
const items = [
  {
    icon: 'i-lucide-code-2',
    label: 'Üzerinde çalışıyorum',
    value: 'Bu blog ve kişisel yazılım projeleri'
  },
  {
    icon: 'i-lucide-radar',
    label: 'Odaklanıyorum',
    value: 'Savunma sanayii ve teknik gelişim'
  },
  {
    icon: 'i-lucide-plane',
    label: 'Planlıyorum',
    value: 'İtalya’da yüksek lisans ve yeni rotalar'
  }
]
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div class="mb-9">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        Şu sıralar
      </p>
      <h2 class="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
        Gündemimde neler var?
      </h2>
    </div>

    <div class="grid border-y border-neutral-300 dark:border-neutral-700 md:grid-cols-3">
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="py-7 md:px-8 md:first:pl-0 md:last:pr-0"
        :class="index > 0 ? 'border-t border-neutral-300 dark:border-neutral-700 md:border-l md:border-t-0' : ''"
      >
        <div class="flex size-9 items-center justify-center border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <UIcon
            :name="item.icon"
            class="size-4 text-primary"
          />
        </div>
        <p class="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
          {{ item.label }}
        </p>
        <p class="mt-2 max-w-xs font-display text-xl font-semibold leading-snug text-neutral-950 dark:text-white">
          {{ item.value }}
        </p>
      </div>
    </div>
  </section>
</template>
