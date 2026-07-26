<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

defineProps<{
  title: string
  description: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()

function close() {
  open.value = false
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
    :dismissible="!loading"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          label="İptal"
          :disabled="loading"
          @click="close"
        />
        <UButton
          color="error"
          label="Sil"
          icon="i-lucide-trash-2"
          :loading="loading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
