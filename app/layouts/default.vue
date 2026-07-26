<template>
  <div class="flex min-h-dvh flex-col bg-[#f8f8f6] text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg dark:focus:bg-neutral-900"
    >
      İçeriğe atla
    </a>
    <AppHeader />
    <main
      id="main-content"
      class="flex-1"
    >
      <slot />
    </main>
    <AppFooter />
    <ScrollToTop />
  </div>
</template>
