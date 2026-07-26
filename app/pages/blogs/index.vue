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
  const map = new Map<string, { id: string, name: string, slug: string, count: number }>()

  for (const blog of blogs.value) {
    for (const category of blog.categories ?? []) {
      const existing = map.get(category.id)
      map.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
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
      blog.categories?.some(category =>
        category.slug === selectedCategory.value || category.id === selectedCategory.value
      )
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

function isCategorySelected(category: { id: string, slug: string }) {
  return selectedCategory.value === category.slug || selectedCategory.value === category.id
}

async function selectCategory(categorySlug: string | null) {
  await router.replace({
    query: {
      ...route.query,
      category: categorySlug || undefined
    }
  })
}
</script>

<template>
  <div>
    <section class="border-b border-neutral-800 bg-neutral-950 text-white">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:px-8 lg:py-20">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Arşiv
          </p>
          <h1 class="mt-4 font-display text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Yazılar<span class="text-primary">.</span>
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Teknoloji, mühendislik, yaşam ve deneyimlerden oluşan açık not defteri.
          </p>
        </div>
        <div class="border-t border-white/15 pt-4 text-sm leading-relaxed text-white/45 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
            Toplam arşiv
          </p>
          <p class="mt-2 font-display text-4xl font-semibold text-white">
            {{ blogs.length }}
          </p>
          <p class="mt-1">yayınlanmış yazı</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="grid gap-5 border-b border-neutral-300 pb-7 dark:border-neutral-700 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div class="w-full max-w-2xl">
          <label
            for="blog-search"
            class="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
          >
            Yazılarda ara
          </label>
          <UInput
            id="blog-search"
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Başlık veya kategori ara..."
            size="xl"
            class="w-full"
          />
        </div>
        <p
          class="text-sm font-medium text-neutral-500"
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
            :class="isCategorySelected(category)
              ? 'text-neutral-950 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-primary dark:text-white'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'"
            :aria-selected="isCategorySelected(category)"
            @click="selectCategory(category.slug)"
          >
            {{ category.name }} <span class="ml-1 text-xs text-neutral-400">{{ category.count }}</span>
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="border-t border-neutral-200 pt-5 dark:border-neutral-800"
        >
          <div class="aspect-[16/10] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div class="mt-5 h-4 w-24 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div class="mt-3 h-7 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div class="mt-3 h-4 w-4/5 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
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
        <h2 class="mt-4 font-display text-2xl font-semibold">
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
        <h2 class="mt-4 font-display text-2xl font-semibold">
          Eşleşen yazı bulunamadı
        </h2>
        <p class="mt-2 max-w-sm text-sm text-neutral-500">
          Arama kelimelerini veya seçili kategoriyi değiştirerek tekrar deneyin.
        </p>
      </div>

      <div
        v-else
        class="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
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
