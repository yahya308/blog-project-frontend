<script setup lang="ts">
import type { EditorToolbarItem, SelectMenuItem } from '@nuxt/ui'
import type { BlogFormState, Category } from '~/types/blog'
import { slugify } from '~/utils/slugify'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  mode: 'create' | 'edit'
  blogId?: string
  categories: Category[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const toast = useToast()
const router = useRouter()
const { user } = useAuth()
const { createBlog, updateBlog, getBlogById } = useBlogsApi()

const form = reactive<BlogFormState>({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  authorName: '',
  status: 'DRAFT',
  publishedAt: '',
  categoryIds: []
})

const slugManuallyEdited = ref(false)
const seoTitleManuallyEdited = ref(false)
const coverPreviewFailed = ref(false)
const loading = ref(false)
const submitting = ref(false)

const statusOptions: SelectMenuItem[] = [
  { label: 'Taslak', value: 'DRAFT' },
  { label: 'Yayında', value: 'PUBLISHED' }
]

const toolbarItems = [
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code' }
  ],
  [
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3' }
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
    { kind: 'blockquote', icon: 'i-lucide-quote' },
    { kind: 'codeBlock', icon: 'i-lucide-square-code' }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link' },
    { kind: 'image', icon: 'i-lucide-image' },
    { kind: 'horizontalRule', icon: 'i-lucide-minus' }
  ],
  [
    { kind: 'undo', icon: 'i-lucide-undo' },
    { kind: 'redo', icon: 'i-lucide-redo' }
  ]
] satisfies EditorToolbarItem[][]

const categoryItems = computed(() =>
  props.categories.map(category => ({
    label: category.name,
    value: category.id
  }))
)

const showPublishedAt = computed(() => form.status === 'PUBLISHED')

const modalTitle = computed(() =>
  props.mode === 'edit' ? 'Blog Düzenle' : 'Yeni Blog Yazısı'
)

watch(() => form.title, (title) => {
  if (!slugManuallyEdited.value) {
    form.slug = slugify(title)
  }

  if (!seoTitleManuallyEdited.value) {
    form.seoTitle = title
  }
})

watch(() => form.status, (status) => {
  if (status === 'PUBLISHED' && !form.publishedAt) {
    form.publishedAt = new Date().toISOString().slice(0, 16)
  }
})

watch(() => form.coverImage, () => {
  coverPreviewFailed.value = false
})

watch(open, async (isOpen) => {
  if (!isOpen) {
    resetForm()
    return
  }

  if (!user.value) {
    toast.add({
      title: 'Oturum gerekli',
      description: 'Blog işlemleri için giriş yapmalısınız.',
      color: 'warning'
    })
    open.value = false
    await router.push('/admin/login')
    return
  }

  if (props.mode === 'edit' && props.blogId) {
    await loadBlog(props.blogId)
  } else {
    resetForm()
    form.authorName = user.value?.name ?? ''
  }
})

async function loadBlog(id: string) {
  loading.value = true

  try {
    const blog = await getBlogById(id)
    form.title = blog.title
    form.slug = blog.slug
    form.content = blog.content
    form.excerpt = blog.excerpt ?? ''
    form.coverImage = blog.coverImage ?? ''
    form.seoTitle = blog.seoTitle ?? blog.title
    form.seoDescription = blog.seoDescription ?? ''
    form.seoKeywords = blog.seoKeywords ?? ''
    form.authorName = blog.authorName ?? blog.author?.name ?? ''
    form.status = blog.status
    form.publishedAt = blog.publishedAt
      ? new Date(blog.publishedAt).toISOString().slice(0, 16)
      : ''
    form.categoryIds = blog.categories?.map(category => category.id) ?? []
    slugManuallyEdited.value = true
    seoTitleManuallyEdited.value = Boolean(blog.seoTitle)
  } catch {
    toast.add({
      title: 'Blog yüklenemedi',
      description: 'Blog bilgileri alınırken bir hata oluştu.',
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

function onSeoTitleInput() {
  seoTitleManuallyEdited.value = true
}

function resetForm() {
  form.title = ''
  form.slug = ''
  form.content = ''
  form.excerpt = ''
  form.coverImage = ''
  form.seoTitle = ''
  form.seoDescription = ''
  form.seoKeywords = ''
  form.authorName = ''
  form.status = 'DRAFT'
  form.publishedAt = ''
  form.categoryIds = []
  slugManuallyEdited.value = false
  seoTitleManuallyEdited.value = false
}

function validate() {
  const errors: { name: string, message: string }[] = []

  if (!form.title.trim()) {
    errors.push({ name: 'title', message: 'Başlık zorunludur' })
  }

  if (!form.authorName.trim()) {
    errors.push({ name: 'authorName', message: 'Yazar adı zorunludur' })
  }

  if (!form.slug.trim()) {
    errors.push({ name: 'slug', message: 'Slug zorunludur' })
  }

  const plainContent = form.content.replace(/<[^>]*>/g, '').trim()
  if (!plainContent) {
    errors.push({ name: 'content', message: 'İçerik zorunludur' })
  }

  if (form.status === 'PUBLISHED' && !form.publishedAt) {
    errors.push({ name: 'publishedAt', message: 'Yayın tarihi zorunludur' })
  }

  return errors
}

function buildPayload() {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    content: form.content,
    excerpt: form.excerpt.trim() || null,
    coverImage: form.coverImage.trim() || null,
    seoTitle: form.seoTitle.trim() || null,
    seoDescription: form.seoDescription.trim() || null,
    seoKeywords: form.seoKeywords.trim() || null,
    authorName: form.authorName.trim(),
    status: form.status,
    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    categoryIds: form.categoryIds
  }
}

function close() {
  open.value = false
}

async function handleSubmit(statusOverride?: BlogFormState['status']) {
  if (!user.value) {
    toast.add({
      title: 'Oturum gerekli',
      description: 'Blog işlemleri için giriş yapmalısınız.',
      color: 'warning'
    })
    await router.push('/admin/login')
    return
  }

  if (statusOverride) {
    form.status = statusOverride
    if (statusOverride === 'PUBLISHED' && !form.publishedAt) {
      form.publishedAt = new Date().toISOString().slice(0, 16)
    }
  }

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
    const payload = buildPayload()

    if (props.mode === 'edit' && props.blogId) {
      await updateBlog(props.blogId, payload)
      toast.add({
        title: 'Blog güncellendi',
        color: 'success'
      })
    } else {
      await createBlog(payload)
      toast.add({
        title: form.status === 'PUBLISHED' ? 'Blog yayınlandı' : 'Taslak kaydedildi',
        color: 'success'
      })
    }

    open.value = false
    emit('saved')
  } catch {
    toast.add({
      title: 'Kayıt başarısız',
      description: 'Blog kaydedilirken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
    scrollable
    :dismissible="!submitting"
    :ui="{ content: 'max-w-5xl' }"
  >
    <template #body>
      <div
        v-if="loading"
        class="flex items-center justify-center py-16"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-muted"
        />
      </div>

      <form
        v-else
        class="min-w-0 max-h-[70vh] overflow-x-hidden overflow-y-auto pr-1"
        @submit.prevent="handleSubmit()"
      >
        <div class="grid min-w-0 gap-6 lg:grid-cols-3">
          <div class="min-w-0 space-y-6 lg:col-span-2">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-image"
                    class="size-4 text-muted"
                  />
                  <span class="font-medium">Kapak Fotoğrafı</span>
                </div>
              </template>

              <div class="space-y-4">
                <UFormField
                  label="Görsel URL"
                  name="coverImage"
                  help="Blog sayfasının en üstünde görünecek kapak fotoğrafı."
                >
                  <UInput
                    v-model="form.coverImage"
                    placeholder="https://..."
                    icon="i-lucide-link"
                    class="w-full"
                  />
                </UFormField>

                <div
                  v-if="form.coverImage"
                  class="flex h-64 items-center justify-center overflow-hidden rounded-xl border border-default bg-elevated/50 sm:h-80"
                >
                  <img
                    v-if="!coverPreviewFailed"
                    :src="form.coverImage"
                    alt="Kapak fotoğrafı önizlemesi"
                    class="h-full w-full object-contain"
                    @error="coverPreviewFailed = true"
                  >
                  <div
                    v-else
                    class="px-6 text-center text-sm text-muted"
                    role="status"
                  >
                    <UIcon
                      name="i-lucide-image-off"
                      class="mx-auto mb-2 size-7"
                    />
                    Görsel yüklenemedi. URL adresini kontrol edin.
                  </div>
                </div>
                <div
                  v-else
                  class="flex h-64 items-center justify-center rounded-xl border border-dashed border-default bg-elevated/50 sm:h-80"
                >
                  <div class="text-center text-sm text-muted">
                    <UIcon
                      name="i-lucide-image-plus"
                      class="mx-auto mb-2 size-6"
                    />
                    Kapak fotoğrafı önizlemesi
                  </div>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="space-y-5">
                <UFormField
                  label="Başlık"
                  name="title"
                  required
                >
                  <UInput
                    v-model="form.title"
                    placeholder="Blog yazınızın başlığı"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Slug"
                  name="slug"
                  required
                  help="URL'de görünecek kısa adres. Başlıktan otomatik oluşturulur."
                >
                  <UInput
                    v-model="form.slug"
                    placeholder="ornek-blog-yazisi"
                    icon="i-lucide-link"
                    class="w-full"
                    @input="onSlugInput"
                  />
                </UFormField>
              </div>
            </UCard>

            <UCard>
              <UFormField
                label="İçerik"
                name="content"
                required
              >
                <UEditor
                  v-slot="{ editor }"
                  v-model="form.content"
                  content-type="html"
                  placeholder="Blog içeriğinizi buraya yazın..."
                  class="min-h-80 w-full min-w-0 rounded-lg border border-default"
                >
                  <UEditorToolbar
                    :editor="editor"
                    :items="toolbarItems"
                    class="flex-wrap rounded-t-lg border-b border-default"
                  />
                </UEditor>
              </UFormField>
            </UCard>
          </div>

          <div class="min-w-0 space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-settings-2"
                    class="size-4 text-muted"
                  />
                  <span class="font-medium">Yayın Ayarları</span>
                </div>
              </template>

              <div class="space-y-5">
                <UFormField
                  label="Yazar Adı"
                  name="authorName"
                  required
                  help="Blog sayfasında görünecek yazar ismi."
                >
                  <UInput
                    v-model="form.authorName"
                    placeholder="Örn: Yahya Baltacı"
                    icon="i-lucide-user"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Durum"
                  name="status"
                >
                  <USelectMenu
                    v-model="form.status"
                    value-key="value"
                    :items="statusOptions"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  v-if="showPublishedAt"
                  label="Yayın Tarihi"
                  name="publishedAt"
                  required
                >
                  <UInput
                    v-model="form.publishedAt"
                    type="datetime-local"
                    icon="i-lucide-calendar-clock"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-search"
                    class="size-4 text-muted"
                  />
                  <span class="font-medium">SEO Ayarları</span>
                </div>
              </template>

              <div class="space-y-5">
                <UFormField
                  label="SEO Başlığı"
                  name="seoTitle"
                  help="Boş bırakılırsa blog başlığı kullanılır."
                >
                  <UInput
                    v-model="form.seoTitle"
                    placeholder="Arama motorlarında görünecek başlık"
                    class="w-full"
                    @input="onSeoTitleInput"
                  />
                </UFormField>

                <UFormField
                  label="SEO Açıklaması"
                  name="seoDescription"
                  help="Boş bırakılırsa özet kullanılır. 150-160 karakter önerilir."
                >
                  <UTextarea
                    v-model="form.seoDescription"
                    placeholder="Arama sonuçlarında görünecek açıklama"
                    :rows="3"
                    autoresize
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Anahtar Kelimeler"
                  name="seoKeywords"
                  help="Virgülle ayırarak girin. Örn: teknoloji, yazılım, blog"
                >
                  <UInput
                    v-model="form.seoKeywords"
                    placeholder="anahtar, kelime, listesi"
                    icon="i-lucide-tags"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-text"
                    class="size-4 text-muted"
                  />
                  <span class="font-medium">Özet</span>
                </div>
              </template>

              <UFormField
                label="Kısa Açıklama"
                name="excerpt"
                help="Liste ve arama sonuçlarında görünür. Boş bırakılabilir."
              >
                <UTextarea
                  v-model="form.excerpt"
                  placeholder="Yazının kısa özetini girin..."
                  :rows="4"
                  autoresize
                  class="w-full"
                />
              </UFormField>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-tags"
                    class="size-4 text-muted"
                  />
                  <span class="font-medium">Kategoriler</span>
                </div>
              </template>

              <UFormField
                label="Kategori Seçimi"
                name="categoryIds"
                help="Yazıya bir veya birden fazla kategori ekleyin."
              >
                <USelectMenu
                  v-model="form.categoryIds"
                  value-key="value"
                  multiple
                  :items="categoryItems"
                  placeholder="Kategori seçin"
                  class="w-full"
                />
              </UFormField>
            </UCard>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          label="İptal"
          :disabled="submitting"
          @click="close"
        />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-save"
          label="Taslak Kaydet"
          :loading="submitting"
          @click="handleSubmit('DRAFT')"
        />
        <UButton
          icon="i-lucide-send"
          :label="mode === 'edit' ? 'Güncelle' : 'Yayınla'"
          :loading="submitting"
          @click="handleSubmit('PUBLISHED')"
        />
      </div>
    </template>
  </UModal>
</template>
