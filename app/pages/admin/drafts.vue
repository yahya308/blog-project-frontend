<script setup lang="ts">
import type { Category } from '~/types/blog'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  pageTransition: false
})

useSeoMeta({
  title: 'Taslaklar'
})

const router = useRouter()
const { user, logout } = useAuth()
const { getCategories } = useCategoriesApi()

const categories = ref<Category[]>([])

async function handleLogout() {
  await logout()
  useDashboardStore().resetStats()
  await router.push('/admin/login')
}

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch {
    categories.value = []
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1">
    <UDashboardPanel id="admin-drafts">
      <template #header>
        <UDashboardNavbar
          title="Taslaklar"
          icon="i-lucide-file-pen"
        >
          <template #left>
            <AdminNavbarLeft />
          </template>
          <template #right>
            <span
              v-if="user?.email"
              class="hidden text-sm text-muted sm:inline"
            >
              {{ user.email }}
            </span>
            <UButton
              label="Çıkış Yap"
              icon="i-lucide-log-out"
              color="neutral"
              variant="ghost"
              @click="handleLogout"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="p-4 lg:p-6">
          <div class="mb-6">
            <h1 class="text-xl font-semibold">
              Taslak Bloglar
            </h1>
            <p class="mt-1 text-sm text-muted">
              Henüz yayınlanmamış blog yazılarınız.
            </p>
          </div>

          <AdminBlogListTab
            :categories="categories"
            status-filter="DRAFT"
          />
        </div>
      </template>
    </UDashboardPanel>
  </div>
</template>
