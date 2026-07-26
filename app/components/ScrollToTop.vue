<script setup lang="ts">
const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <button
      v-if="visible"
      type="button"
      class="fixed bottom-4 right-4 z-40 inline-flex size-11 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-600 shadow-lg backdrop-blur-sm transition hover:bg-neutral-50 hover:text-neutral-900 sm:bottom-6 sm:right-6 dark:border-neutral-700/80 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
      aria-label="Yukarı çık"
      @click="scrollToTop"
    >
      <UIcon
        name="i-lucide-arrow-up"
        class="size-4.5"
      />
    </button>
  </Transition>
</template>
