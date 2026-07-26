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
      <p class="text-sm font-medium uppercase tracking-wider text-neutral-500">
        Şu sıralar
      </p>
      <h2 class="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
        Gündemimde neler var?
      </h2>
    </div>

    <div class="grid border-y border-neutral-200 dark:border-neutral-800 md:grid-cols-3">
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="py-6 md:px-7 md:first:pl-0 md:last:pr-0"
        :class="index > 0 ? 'border-t border-neutral-200 dark:border-neutral-800 md:border-l md:border-t-0' : ''"
      >
        <UIcon
          :name="item.icon"
          class="size-5 text-primary"
        />
        <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {{ item.label }}
        </p>
        <p class="mt-2 font-medium leading-relaxed text-neutral-900 dark:text-white">
          {{ item.value }}
        </p>
      </div>
    </div>
  </section>
</template>
