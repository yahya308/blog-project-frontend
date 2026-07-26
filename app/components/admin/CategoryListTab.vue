<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Category } from '~/types/blog'

const toast = useToast()
const { getCategories, deleteCategory } = useCategoriesApi()

const categories = ref<Category[]>([])
const loading = ref(false)

const categoryDialogOpen = ref(false)
const categoryDialogMode = ref<'create' | 'edit'>('create')
const selectedCategoryId = ref<string>()

const deleteModalOpen = ref(false)
const deleteTarget = ref<Category>()
const deleting = ref(false)

const deleteDescription = computed(() =>
  deleteTarget.value
    ? `"${deleteTarget.value.name}" kategorisini silmek istediğinize emin misiniz?`
    : ''
)

const columns: TableColumn<Category>[] = [
  { accessorKey: 'name', header: 'Ad' },
  { accessorKey: 'slug', header: 'Slug' },
  { id: 'actions', header: 'İşlemler' }
]

const emit = defineEmits<{
  changed: []
}>()

async function fetchCategories() {
  loading.value = true

  try {
    categories.value = await getCategories()
    emit('changed')
  } catch {
    toast.add({
      title: 'Kategoriler yüklenemedi',
      description: 'Kategori listesi alınırken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  categoryDialogMode.value = 'create'
  selectedCategoryId.value = undefined
  categoryDialogOpen.value = true
}

function openEditDialog(category: Category) {
  categoryDialogMode.value = 'edit'
  selectedCategoryId.value = category.id
  categoryDialogOpen.value = true
}

function openDeleteModal(category: Category) {
  deleteTarget.value = category
  deleteModalOpen.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) {
    return
  }

  deleting.value = true

  try {
    await deleteCategory(deleteTarget.value.id)
    toast.add({
      title: 'Kategori silindi',
      color: 'success'
    })
    deleteModalOpen.value = false
    await fetchCategories()
  } catch {
    toast.add({
      title: 'Silme başarısız',
      description: 'Kategori silinirken bir hata oluştu. İlişkili bloglar olabilir.',
      color: 'error'
    })
  } finally {
    deleting.value = false
  }
}

onMounted(fetchCategories)

defineExpose({
  refresh: fetchCategories,
  categories
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        icon="i-lucide-plus"
        label="Yeni Kategori"
        @click="openCreateDialog"
      />
    </div>

    <UEmpty
      v-if="!loading && categories.length === 0"
      icon="i-lucide-tags"
      title="Henüz kategori yok"
      description="İlk kategorinizi oluşturun."
    >
      <UButton
        icon="i-lucide-plus"
        label="Yeni Kategori"
        @click="openCreateDialog"
      />
    </UEmpty>

    <UTable
      v-else
      :data="categories"
      :columns="columns"
      :loading="loading"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="`${row.original.name} kategorisini düzenle`"
            :title="`${row.original.name} kategorisini düzenle`"
            @click="openEditDialog(row.original)"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            :aria-label="`${row.original.name} kategorisini sil`"
            :title="`${row.original.name} kategorisini sil`"
            @click="openDeleteModal(row.original)"
          />
        </div>
      </template>
    </UTable>

    <AdminCategoryFormDialog
      v-model:open="categoryDialogOpen"
      :mode="categoryDialogMode"
      :category-id="selectedCategoryId"
      @saved="fetchCategories"
    />

    <AdminConfirmDeleteModal
      v-model:open="deleteModalOpen"
      title="Kategoriyi Sil"
      :description="deleteDescription"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>
