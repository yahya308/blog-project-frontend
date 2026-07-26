<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { Category } from '~/types/blog'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  pageTransition: false
})

useSeoMeta({
  title: 'İçerik Yönetimi'
})

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { getCategories } = useCategoriesApi()

const activeTab = computed({
  get: () => (route.query.tab === 'categories' ? 'categories' : 'blogs'),
  set: (value: string) => {
    router.replace({
      query: value === 'blogs' ? {} : { tab: value }
    })
  }
})

async function handleLogout() {
  await logout()
  await router.push('/admin/login')
}

const categories = ref<Category[]>([])

const tabItems: TabsItem[] = [
  {
    label: 'Bloglar',
    icon: 'i-lucide-file-text',
    slot: 'blogs',
    value: 'blogs'
  },
  {
    label: 'Kategoriler',
    icon: 'i-lucide-tags',
    slot: 'categories',
    value: 'categories'
  }
]

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch {
    categories.value = []
  }
}

function onCategoriesChanged() {
  fetchCategories()
  useDashboardStore().fetchDashboardData()
}

onMounted(fetchCategories)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1">
    <UDashboardPanel id="writer-panel">
      <template #header>
        <UDashboardNavbar
          title="İçerik Yönetimi"
          icon="i-lucide-pen-line"
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
          <UTabs
            v-model="activeTab"
            :items="tabItems"
            :unmount-on-hide="false"
            class="w-full"
          >
            <template #blogs>
              <AdminBlogListTab :categories="categories" />
            </template>

            <template #categories>
              <AdminCategoryListTab @changed="onCategoriesChanged" />
            </template>
          </UTabs>
        </div>
      </template>
    </UDashboardPanel>
  </div>
</template>
