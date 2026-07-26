<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  icon: string
  loading?: boolean
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-default bg-elevated p-5 min-h-[120px]">
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm font-medium text-muted">
        {{ label }}
      </p>
      <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <UIcon
          :name="icon"
          class="size-4.5 text-neutral-600 dark:text-neutral-300"
        />
      </div>
    </div>

    <div>
      <div
        v-if="loading"
        class="h-9 w-16 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700"
      />
      <p
        v-else
        class="text-3xl font-semibold tracking-tight"
      >
        {{ value }}
      </p>
    </div>
  </div>
</template>
