<script setup lang="ts">
import type { Blog } from '~/types/blog'

useSeoMeta({
  title: 'Yazılar',
  description: 'Teknoloji, yaşam, seyahat ve daha fazlası üzerine kişisel blog yazıları.'
})

const { getPublishedBlogs } = useBlogsApi()
const route = useRoute()
const router = useRouter()
const searchQuery = ref('')

const {
  data: publishedBlogs,
  pending: loading,
  error: loadError,
  refresh
} = await useAsyncData<Blog[]>('published-blogs', () => getPublishedBlogs())

const blogs = computed(() => publishedBlogs.value ?? [])

const selectedCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null
)

const categories = computed(() => {
  const map = new Map<string, { id: string, name: string, count: number }>()

  for (const blog of blogs.value) {
    for (const category of blog.categories ?? []) {
      const existing = map.get(category.id)
      map.set(category.id, {
        id: category.id,
        name: category.name,
        count: (existing?.count ?? 0) + 1
      })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
})

const filteredBlogs = computed(() => {
  let result = blogs.value

  if (selectedCategory.value) {
    result = result.filter(blog =>
      blog.categories?.some(category => category.id === selectedCategory.value)
    )
  }

  const query = searchQuery.value.trim().toLocaleLowerCase('tr-TR')
  if (!query) {
    return result
  }

  return result.filter((blog) => {
    const haystack = [
      blog.title,
      blog.excerpt,
      blog.authorName,
      blog.author?.name,
      ...(blog.categories?.map(category => category.name) ?? [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('tr-TR')

    return haystack.includes(query)
  })
})

async function selectCategory(categoryId: string | null) {
  await router.replace({
    query: {
      ...route.query,
      category: categoryId || undefined
    }
  })
}
</script>

<template>
  <div>
    <section class="border-b border-neutral-800 bg-neutral-950 text-white">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p class="text-sm font-bold uppercase tracking-wider text-primary">
          Arşiv
        </p>
        <h1 class="mt-3 text-4xl font-bold sm:text-5xl">
          Yazılar
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          Teknoloji, yaşam, seyahat ve deneyimlerden oluşan tüm yayınlar tek yerde.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between">
        <div class="w-full max-w-xl">
          <label
            for="blog-search"
            class="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200"
          >
            Yazılarda ara
          </label>
          <UInput
            id="blog-search"
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Başlık, yazar veya kategori..."
            size="xl"
            class="w-full"
          />
        </div>
        <p
          class="shrink-0 text-sm font-medium text-neutral-500"
          aria-live="polite"
        >
          {{ filteredBlogs.length }} yazı gösteriliyor
        </p>
      </div>

      <div
        v-if="categories.length"
        class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <div
          class="flex min-w-max border-b border-neutral-200 dark:border-neutral-800"
          role="tablist"
          aria-label="Yazı kategorileri"
        >
          <button
            type="button"
            role="tab"
            class="relative min-h-12 px-4 text-sm font-semibold transition"
            :class="selectedCategory === null
              ? 'text-neutral-950 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-primary dark:text-white'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'"
            :aria-selected="selectedCategory === null"
            @click="selectCategory(null)"
          >
            Tümü <span class="ml-1 text-xs text-neutral-400">{{ blogs.length }}</span>
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            role="tab"
            class="relative min-h-12 px-4 text-sm font-semibold transition"
            :class="selectedCategory === category.id
              ? 'text-neutral-950 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-primary dark:text-white'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'"
            :aria-selected="selectedCategory === category.id"
            @click="selectCategory(category.id)"
          >
            {{ category.name }} <span class="ml-1 text-xs text-neutral-400">{{ category.count }}</span>
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
        >
          <div class="aspect-[16/10] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div class="space-y-3 p-5">
            <div class="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div class="h-6 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div class="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>

      <div
        v-else-if="loadError"
        class="flex min-h-72 flex-col items-center justify-center border-b border-neutral-200 text-center dark:border-neutral-800"
      >
        <UIcon
          name="i-lucide-wifi-off"
          class="size-9 text-neutral-400"
        />
        <h2 class="mt-4 text-lg font-bold">
          Yazılar yüklenemedi
        </h2>
        <UButton
          class="mt-5"
          icon="i-lucide-refresh-cw"
          label="Tekrar Dene"
          variant="outline"
          @click="() => refresh()"
        />
      </div>

      <div
        v-else-if="filteredBlogs.length === 0"
        class="flex min-h-72 flex-col items-center justify-center border-b border-neutral-200 text-center dark:border-neutral-800"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-9 text-neutral-400"
        />
        <h2 class="mt-4 text-lg font-bold">
          Eşleşen yazı bulunamadı
        </h2>
        <p class="mt-2 max-w-sm text-sm text-neutral-500">
          Arama kelimelerini veya seçili kategoriyi değiştirerek tekrar deneyin.
        </p>
      </div>

      <div
        v-else
        class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <BlogCard
          v-for="blog in filteredBlogs"
          :key="blog.id"
          :blog="blog"
        />
      </div>
    </section>
  </div>
</template>
