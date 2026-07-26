<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'admin-entry',
  pageTransition: false
})
</script>

<template>
  <div
    class="flex min-h-48 items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-6 animate-spin text-muted"
    />
    <span class="sr-only">Yönlendiriliyor</span>
  </div>
</template>
