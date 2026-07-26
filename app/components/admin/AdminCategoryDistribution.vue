<script setup lang="ts">
const props = defineProps<{
  items: {
    id: string
    name: string
    count: number
  }[]
  loading?: boolean
}>()

const maxCount = computed(() => {
  const counts = props.items.map(item => item.count)
  return Math.max(...counts, 1)
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-bar-chart-3"
          class="size-4 text-muted"
        />
        <span class="font-medium">Kategori Dağılımı</span>
      </div>
    </template>

    <div
      v-if="loading"
      class="space-y-4"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="h-8 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
      />
    </div>

    <UEmpty
      v-else-if="items.length === 0"
      icon="i-lucide-tags"
      title="Henüz veri yok"
      description="Yayınlanmış blog ve kategori eşleşmesi bulunamadı."
    />

    <div
      v-else
      class="space-y-4"
    >
      <div
        v-for="item in items"
        :key="item.id"
      >
        <div class="mb-1.5 flex items-center justify-between text-sm">
          <span class="font-medium">{{ item.name }}</span>
          <span class="text-muted">{{ item.count }}</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            class="h-full rounded-full bg-neutral-900 transition-all dark:bg-white"
            :style="{ width: `${(item.count / maxCount) * 100}%` }"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
