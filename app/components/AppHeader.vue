<script setup lang="ts">
import { SITE_NAME } from '~/utils/site'

const route = useRoute()
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Yazılar', to: '/blogs' },
  { label: 'Hakkımda', to: '/hakkimda' }
]

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    mobileMenuOpen.value = false
  }
}

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/85">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <NuxtLink
        to="/"
        class="group flex min-w-0 items-center gap-3"
        aria-label="Ana sayfa"
      >
        <img
          src="/icon-512.png"
          alt=""
          width="36"
          height="36"
          aria-hidden="true"
          class="size-9 shrink-0 rounded-md object-cover shadow-sm ring-1 ring-neutral-200/70 transition-transform duration-200 group-hover:scale-105 dark:ring-neutral-800"
        >
        <span class="truncate text-base font-bold text-neutral-950 dark:text-white sm:text-lg">
          {{ SITE_NAME }}
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-3 sm:flex">
        <nav
          class="flex h-16 items-center gap-1"
          aria-label="Ana navigasyon"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative flex h-full items-center px-3 text-sm font-semibold transition"
            :class="isActive(link.to)
              ? 'text-neutral-950 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary dark:text-white'
              : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-lg border border-transparent text-neutral-500 transition hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-neutral-400 dark:hover:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white"
          aria-label="Renk temasını değiştir"
          title="Renk temasını değiştir"
          @click="toggleColorMode"
        >
          <UIcon
            name="i-lucide-moon"
            class="size-5 dark:hidden"
          />
          <UIcon
            name="i-lucide-sun"
            class="hidden size-5 dark:block"
          />
        </button>
      </div>

      <div class="flex items-center gap-1 sm:hidden">
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          aria-label="Renk temasını değiştir"
          title="Renk temasını değiştir"
          @click="toggleColorMode"
        >
          <UIcon
            name="i-lucide-moon"
            class="size-5 dark:hidden"
          />
          <UIcon
            name="i-lucide-sun"
            class="hidden size-5 dark:block"
          />
        </button>
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-navigation"
          :aria-label="mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <UIcon
            :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            class="size-5"
          />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="mobileMenuOpen"
        id="mobile-navigation"
        class="border-t border-neutral-200 bg-white px-4 py-3 shadow-lg sm:hidden dark:border-neutral-800 dark:bg-neutral-950"
        aria-label="Mobil navigasyon"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex min-h-12 items-center justify-between border-b border-neutral-100 px-2 text-base font-semibold last:border-b-0 dark:border-neutral-900"
          :class="isActive(link.to) ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4"
          />
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
