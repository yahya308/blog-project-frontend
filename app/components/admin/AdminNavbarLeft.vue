<template>
  <div class="flex items-center gap-1">
    <UButton
      to="/"
      label="Ana Sayfa"
      icon="i-lucide-house"
      color="neutral"
      variant="ghost"
      class="hidden sm:inline-flex"
    />
    <UButton
      to="/"
      icon="i-lucide-house"
      color="neutral"
      variant="ghost"
      aria-label="Ana sayfaya dön"
      class="sm:hidden"
    />
  </div>
</template>
