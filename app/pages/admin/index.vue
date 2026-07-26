<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
  pageTransition: false
})

const toast = useToast()
const router = useRouter()
const { login, loading, getRedirectPath } = useAuth()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'E-posta',
    placeholder: 'ornek@email.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Şifre',
    placeholder: '••••••••',
    required: true
  }
]

async function onSubmit(event: FormSubmitEvent<{ email: string, password: string }>) {
  try {
    await login(event.data)

    toast.add({
      title: 'Giriş başarılı',
      description: 'Yönetim paneline yönlendiriliyorsunuz.',
      color: 'success'
    })

    await router.push(getRedirectPath())
  } catch {
    toast.add({
      title: 'Giriş başarısız',
      description: 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="flex w-full justify-center">
    <UPageCard
      variant="subtle"
      class="w-full max-w-md"
    >
      <UAuthForm
        title="Yönetim Paneli"
        description="Admin hesabınızla giriş yapın."
        icon="i-lucide-lock-keyhole"
        :fields="fields"
        :loading="loading"
        :submit="{ label: 'Giriş Yap', block: true }"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
