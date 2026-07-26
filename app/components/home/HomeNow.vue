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
  <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
    <div class="mb-8">
      <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        <span class="h-px w-6 bg-primary/60" />
        Şu sıralar
      </p>
      <h2 class="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
        Gündemimde neler var?
      </h2>
    </div>

    <div class="grid overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-3">
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 sm:p-7"
        :class="index > 0 ? 'border-t border-neutral-200 dark:border-neutral-800 md:border-l md:border-t-0' : ''"
      >
        <span class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
          <UIcon
            :name="item.icon"
            class="size-5"
          />
        </span>
        <p class="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {{ item.label }}
        </p>
        <p class="mt-2 font-medium leading-relaxed text-neutral-950 dark:text-white">
          {{ item.value }}
        </p>
      </div>
    </div>
  </section>
</template>
