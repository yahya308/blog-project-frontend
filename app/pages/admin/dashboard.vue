<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Blog, Category } from '~/types/blog'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  pageTransition: false
})

useSeoMeta({
  title: 'Admin Dashboard'
})

const router = useRouter()
const { user, logout } = useAuth()
const { getCategories } = useCategoriesApi()
const dashboardStore = useDashboardStore()
const {
  stats,
  recentBlogs,
  categoryDistribution,
  loading: statsLoading
} = storeToRefs(dashboardStore)

const categories = ref<Category[]>([])
const blogDialogOpen = ref(false)
const selectedBlogId = ref<string>()

async function loadDashboard() {
  await dashboardStore.fetchDashboardData()

  try {
    categories.value = await getCategories()
  } catch {
    categories.value = []
  }
}

async function handleLogout() {
  await logout()
  dashboardStore.resetStats()
  await router.push('/admin')
}

function openRecentBlogEdit(blog: Blog) {
  selectedBlogId.value = blog.id
  blogDialogOpen.value = true
}

function onBlogSaved() {
  blogDialogOpen.value = false
  dashboardStore.fetchDashboardData()
}

onMounted(loadDashboard)
onActivated(loadDashboard)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1">
    <UDashboardPanel id="admin-dashboard">
      <template #header>
        <UDashboardNavbar
          title="Dashboard"
          icon="i-lucide-layout-dashboard"
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
        <div class="space-y-6 p-4 lg:p-6">
          <section class="space-y-4">
            <div>
              <h1 class="text-2xl font-semibold tracking-tight">
                Hoş geldin{{ user?.name ? `, ${user.name}` : '' }}
              </h1>
              <p class="mt-1 text-muted">
                Blog içeriklerinizi buradan yönetebilirsiniz.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UButton
                to="/admin/writer"
                icon="i-lucide-plus"
                label="Yeni Blog"
              />
              <UButton
                to="/admin/writer?tab=categories"
                icon="i-lucide-tags"
                label="Kategori Ekle"
                color="neutral"
                variant="outline"
              />
              <UButton
                to="/"
                target="_blank"
                icon="i-lucide-external-link"
                label="Siteyi Görüntüle"
                color="neutral"
                variant="ghost"
              />
            </div>
          </section>

          <UAlert
            v-if="!statsLoading && stats.draft > 0"
            color="warning"
            variant="subtle"
            icon="i-lucide-file-pen"
            title="Yayınlanmamış taslaklarınız var"
            :description="`${stats.draft} blog taslak durumunda. Yayınlamadan önce gözden geçirin.`"
          >
            <template #actions>
              <UButton
                to="/admin/drafts"
                label="Taslakları Gör"
                color="warning"
                variant="soft"
                size="sm"
              />
            </template>
          </UAlert>

          <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminStatBlock
              label="Yayınlanmış"
              :value="stats.published"
              icon="i-lucide-circle-check"
              :loading="statsLoading"
            />
            <AdminStatBlock
              label="Taslaklar"
              :value="stats.draft"
              icon="i-lucide-file-pen"
              :loading="statsLoading"
            />
            <AdminStatBlock
              label="Toplam Blog"
              :value="stats.total"
              icon="i-lucide-files"
              :loading="statsLoading"
            />
            <AdminStatBlock
              label="Kategoriler"
              :value="stats.categories"
              icon="i-lucide-tags"
              :loading="statsLoading"
            />
            <AdminStatBlock
              label="SEO Eksik"
              :value="stats.missingSeo"
              icon="i-lucide-search-x"
              :loading="statsLoading"
            />
            <AdminStatBlock
              label="Kapak Eksik"
              :value="stats.missingCover"
              icon="i-lucide-image-off"
              :loading="statsLoading"
            />
          </section>

          <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AdminRecentBlogs
              :blogs="recentBlogs"
              :loading="statsLoading"
              @edit="openRecentBlogEdit"
            />
            <AdminCategoryDistribution
              :items="categoryDistribution"
              :loading="statsLoading"
            />
          </section>
        </div>

        <AdminBlogFormDialog
          v-model:open="blogDialogOpen"
          mode="edit"
          :blog-id="selectedBlogId"
          :categories="categories"
          @saved="onBlogSaved"
        />
      </template>
    </UDashboardPanel>
  </div>
</template>
