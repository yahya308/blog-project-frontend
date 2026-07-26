<script setup lang="ts">
import { tr } from '@nuxt/ui/locale'

const requestUrl = useRequestURL()
const socialImage = computed(() => new URL('/og.png', requestUrl.origin).toString())

useSeoMeta({
  ogImage: socialImage,
  twitterImage: socialImage,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :locale="tr">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
