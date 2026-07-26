<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Blog, BlogStatus, Category } from '~/types/blog'

const props = defineProps<{
  categories: Category[]
  statusFilter?: BlogStatus
  hideCreateButton?: boolean
}>()

const toast = useToast()
const { getBlogsList, deleteBlog } = useBlogsApi()

const search = ref('')
const blogs = ref<Blog[]>([])
const loading = ref(false)

const blogDialogOpen = ref(false)
const blogDialogMode = ref<'create' | 'edit'>('create')
const selectedBlogId = ref<string>()

const deleteModalOpen = ref(false)
const deleteTarget = ref<Blog>()
const deleting = ref(false)

const statusLabels: Record<BlogStatus, string> = {
  DRAFT: 'Taslak',
  PUBLISHED: 'Yayında'
}

const statusColors: Record<BlogStatus, 'neutral' | 'success' | 'warning'> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success'
}

const filteredBlogs = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return blogs.value
  }

  return blogs.value.filter(blog =>
    blog.title.toLowerCase().includes(query)
    || blog.slug.toLowerCase().includes(query)
  )
})

const deleteDescription = computed(() =>
  deleteTarget.value
    ? `"${deleteTarget.value.title}" blog yazısını silmek istediğinize emin misiniz?`
    : ''
)

const columns: TableColumn<Blog>[] = [
  { accessorKey: 'title', header: 'Başlık' },
  { accessorKey: 'status', header: 'Durum' },
  { accessorKey: 'publishedAt', header: 'Yayın Tarihi' },
  { accessorKey: 'updatedAt', header: 'Güncellenme' },
  { id: 'actions', header: 'İşlemler' }
]

function formatDate(value?: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

async function fetchBlogs() {
  loading.value = true

  try {
    const result = await getBlogsList({
      status: props.statusFilter,
      limit: 50
    })
    blogs.value = result.blogs
  } catch {
    toast.add({
      title: 'Bloglar yüklenemedi',
      description: 'Blog listesi alınırken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  blogDialogMode.value = 'create'
  selectedBlogId.value = undefined
  blogDialogOpen.value = true
}

function openEditDialog(blog: Blog) {
  blogDialogMode.value = 'edit'
  selectedBlogId.value = blog.id
  blogDialogOpen.value = true
}

function openDeleteModal(blog: Blog) {
  deleteTarget.value = blog
  deleteModalOpen.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) {
    return
  }

  deleting.value = true

  try {
    await deleteBlog(deleteTarget.value.id)
    toast.add({
      title: 'Blog silindi',
      color: 'success'
    })
    deleteModalOpen.value = false
    await onBlogSaved()
  } catch {
    toast.add({
      title: 'Silme başarısız',
      description: 'Blog silinirken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    deleting.value = false
  }
}

onMounted(fetchBlogs)

async function onBlogSaved() {
  await fetchBlogs()
  useDashboardStore().fetchDashboardData()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Blog ara..."
        aria-label="Bloglarda ara"
        class="w-full sm:max-w-xs"
      />

      <UButton
        v-if="!hideCreateButton"
        icon="i-lucide-plus"
        label="Yeni Blog"
        @click="openCreateDialog"
      />
    </div>

    <UEmpty
      v-if="!loading && filteredBlogs.length === 0"
      icon="i-lucide-file-text"
      title="Henüz blog yok"
      description="İlk blog yazınızı oluşturun."
    >
      <UButton
        v-if="!hideCreateButton"
        icon="i-lucide-plus"
        label="Yeni Blog"
        @click="openCreateDialog"
      />
    </UEmpty>

    <UTable
      v-else
      :data="filteredBlogs"
      :columns="columns"
      :loading="loading"
      class="flex-1"
    >
      <template #status-cell="{ row }">
        <UBadge
          :color="statusColors[row.original.status]"
          variant="subtle"
        >
          {{ statusLabels[row.original.status] }}
        </UBadge>
      </template>

      <template #publishedAt-cell="{ row }">
        {{ formatDate(row.original.publishedAt) }}
      </template>

      <template #updatedAt-cell="{ row }">
        {{ formatDate(row.original.updatedAt) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="`${row.original.title} yazısını düzenle`"
            :title="`${row.original.title} yazısını düzenle`"
            @click="openEditDialog(row.original)"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            :aria-label="`${row.original.title} yazısını sil`"
            :title="`${row.original.title} yazısını sil`"
            @click="openDeleteModal(row.original)"
          />
        </div>
      </template>
    </UTable>

    <AdminBlogFormDialog
      v-model:open="blogDialogOpen"
      :mode="blogDialogMode"
      :blog-id="selectedBlogId"
      :categories="props.categories"
      @saved="onBlogSaved"
    />

    <AdminConfirmDeleteModal
      v-model:open="deleteModalOpen"
      title="Blogu Sil"
      :description="deleteDescription"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>
