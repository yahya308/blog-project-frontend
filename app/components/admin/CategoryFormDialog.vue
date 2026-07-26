<script setup lang="ts">
import type { CategoryFormState } from '~/types/blog'
import { slugify } from '~/utils/slugify'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  mode: 'create' | 'edit'
  categoryId?: string
}>()

const emit = defineEmits<{
  saved: []
}>()

const toast = useToast()
const { createCategory, updateCategory, getCategoryById } = useCategoriesApi()

const form = reactive<CategoryFormState>({
  name: '',
  slug: ''
})

const slugManuallyEdited = ref(false)
const loading = ref(false)
const submitting = ref(false)

watch(() => form.name, (name) => {
  if (!slugManuallyEdited.value) {
    form.slug = slugify(name)
  }
})

watch(open, async (isOpen) => {
  if (!isOpen) {
    resetForm()
    return
  }

  if (props.mode === 'edit' && props.categoryId) {
    await loadCategory(props.categoryId)
  } else {
    resetForm()
  }
})

async function loadCategory(id: string) {
  loading.value = true

  try {
    const category = await getCategoryById(id)
    form.name = category.name
    form.slug = category.slug
    slugManuallyEdited.value = true
  } catch {
    toast.add({
      title: 'Kategori yüklenemedi',
      description: 'Kategori bilgileri alınırken bir hata oluştu.',
      color: 'error'
    })
    open.value = false
  } finally {
    loading.value = false
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function resetForm() {
  form.name = ''
  form.slug = ''
  slugManuallyEdited.value = false
}

function validate() {
  const errors: { name: string, message: string }[] = []

  if (!form.name.trim()) {
    errors.push({ name: 'name', message: 'Kategori adı zorunludur' })
  }

  if (!form.slug.trim()) {
    errors.push({ name: 'slug', message: 'Slug zorunludur' })
  }

  return errors
}

function close() {
  open.value = false
}

async function handleSubmit() {
  const errors = validate()
  if (errors.length > 0) {
    toast.add({
      title: 'Form hatası',
      description: errors[0]?.message,
      color: 'error'
    })
    return
  }

  submitting.value = true

  try {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim()
    }

    if (props.mode === 'edit' && props.categoryId) {
      await updateCategory(props.categoryId, payload)
      toast.add({
        title: 'Kategori güncellendi',
        color: 'success'
      })
    } else {
      await createCategory(payload)
      toast.add({
        title: 'Kategori oluşturuldu',
        color: 'success'
      })
    }

    open.value = false
    emit('saved')
  } catch {
    toast.add({
      title: 'Kayıt başarısız',
      description: 'Kategori kaydedilirken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

const modalTitle = computed(() =>
  props.mode === 'edit' ? 'Kategori Düzenle' : 'Yeni Kategori'
)
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
    :dismissible="!submitting"
  >
    <template #body>
      <div
        v-if="loading"
        class="flex items-center justify-center py-8"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-muted"
        />
      </div>

      <form
        v-else
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField
          label="Kategori Adı"
          name="name"
          required
        >
          <UInput
            v-model="form.name"
            placeholder="Teknoloji"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Slug"
          name="slug"
          required
          help="URL'de görünecek kısa adres."
        >
          <UInput
            v-model="form.slug"
            placeholder="teknoloji"
            icon="i-lucide-link"
            class="w-full"
            @input="onSlugInput"
          />
        </UFormField>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          label="İptal"
          :disabled="submitting"
          @click="close"
        />
        <UButton
          :label="mode === 'edit' ? 'Güncelle' : 'Oluştur'"
          icon="i-lucide-check"
          :loading="submitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
