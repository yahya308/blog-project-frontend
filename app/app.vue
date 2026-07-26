<script setup lang="ts">
import { tr } from '@nuxt/ui/locale'

const requestUrl = useRequestURL()
const socialImage = computed(() => new URL('/og.png', requestUrl.origin).toString())

useHead({
  meta: [
    {
      name: 'google-site-verification',
      content: '3o108XaHMpyf69WML5P--M9xfT11uWxBgP6keFk_a1o'
    }
  ]
})

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
