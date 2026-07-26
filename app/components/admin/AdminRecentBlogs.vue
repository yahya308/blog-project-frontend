<script setup lang="ts">
import type { Blog, BlogStatus } from '~/types/blog'

defineProps<{
  blogs: Blog[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [blog: Blog]
}>()

const statusLabels: Record<BlogStatus, string> = {
  DRAFT: 'Taslak',
  PUBLISHED: 'Yayında'
}

const statusColors: Record<BlogStatus, 'neutral' | 'success' | 'warning'> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success'
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-clock"
          class="size-4 text-muted"
        />
        <span class="font-medium">Son Güncellenen Yazılar</span>
      </div>
    </template>

    <div
      v-if="loading"
      class="space-y-3"
    >
      <div
        v-for="index in 5"
        :key="index"
        class="h-12 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
      />
    </div>

    <UEmpty
      v-else-if="blogs.length === 0"
      icon="i-lucide-file-text"
      title="Henüz aktivite yok"
      description="Blog oluşturduğunuzda burada görünecek."
    />

    <div
      v-else
      class="divide-y divide-default"
    >
      <div
        v-for="blog in blogs"
        :key="blog.id"
        class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
      >
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">
            {{ blog.title }}
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ formatDate(blog.updatedAt) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UBadge
            :color="statusColors[blog.status]"
            variant="subtle"
          >
            {{ statusLabels[blog.status] }}
          </UBadge>
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="`${blog.title} yazısını düzenle`"
            :title="`${blog.title} yazısını düzenle`"
            @click="emit('edit', blog)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
