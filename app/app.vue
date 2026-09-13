<script setup lang="ts">
import { tr } from '@nuxt/ui/locale'
import { SITE_URL } from '~/utils/site'

const requestUrl = useRequestURL()
const socialImage = computed(() => new URL('/og.png', requestUrl.origin).toString())
const route = useRoute()
const error = useError()
const canonicalUrl = computed(() => {
  if (error.value || /^\/admin(?:\/|$)/.test(route.path)) return undefined

  const url = new URL(SITE_URL)
  url.pathname = route.path.replace(/\/+$/, '') || '/'

  // Category filters change the content; tracking parameters and hashes do not.
  if (url.pathname === '/blogs' && typeof route.query.category === 'string' && route.query.category) {
    url.searchParams.set('category', route.query.category)
  }

  return url.href
})

useHead({
  meta: [
    {
      name: 'google-site-verification',
      content: '3o108XaHMpyf69WML5P--M9xfT11uWxBgP6keFk_a1o'
    }
  ]
})

useHead(() => ({
  link: canonicalUrl.value
    ? [{ rel: 'canonical', href: canonicalUrl.value }]
    : []
}))

useSeoMeta({
  ogUrl: canonicalUrl,
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
