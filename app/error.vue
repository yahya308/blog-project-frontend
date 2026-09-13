<script setup lang="ts">
import type { NuxtError } from '#app'
import { tr } from '@nuxt/ui/locale'
import { SITE_NAME } from '~/utils/site'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => notFound.value ? 'Sayfa bulunamadı' : 'Sayfa yüklenemedi')

useSeoMeta({
  title: () => `${title.value} | ${SITE_NAME}`,
  robots: 'noindex, follow'
})
</script>

<template>
  <UApp :locale="tr">
    <NuxtLayout name="default">
      <div class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <UIcon
          :name="notFound ? 'i-lucide-file-question' : 'i-lucide-wifi-off'"
          class="size-10 text-neutral-400"
        />
        <h1 class="mt-5 text-2xl font-bold">
          {{ title }}
        </h1>
        <p class="mt-2 text-neutral-500">
          {{ notFound
            ? 'Aradığınız sayfa mevcut değil veya henüz yayınlanmamış.'
            : 'Geçici bir sorun oluştu. Lütfen biraz sonra tekrar deneyin.' }}
        </p>
        <UButton
          to="/blogs"
          class="mt-6"
          label="Tüm Yazılara Dön"
          icon="i-lucide-arrow-left"
          variant="outline"
          @click.prevent="clearError({ redirect: '/blogs' })"
        />
      </div>
    </NuxtLayout>
  </UApp>
</template>
