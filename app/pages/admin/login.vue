<script setup lang="ts">
const email = ref("");
const password = ref("");
</script>

<template>
    <div class="mx-auto mt-20 max-w-md">
        <h1 class="mb-6 text-2xl font-bold">
            Admin Giriş
        </h1>

        <form class="space-y-4">
            <UFormField label="E-posta">
                <UInput v-model="email" type="email" placeholder="admin@example.com" class="w-full" />
            </UFormField>

            <UFormField label="Şifre">
                <UInput v-model="password" type="password" placeholder="Şifrenizi girin" class="w-full" />
            </UFormField>

            <UButton type="submit" block>
                Giriş yap
            </UButton>
        </form>
    </div>
</template>