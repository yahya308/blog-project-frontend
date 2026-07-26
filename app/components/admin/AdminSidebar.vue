<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin/dashboard'
  },
  {
    label: 'Blog Yaz',
    icon: 'i-lucide-pen-line',
    to: '/admin/writer'
  },
  {
    label: 'Taslaklar',
    icon: 'i-lucide-file-pen',
    to: '/admin/drafts'
  }
]
</script>

<template>
  <UDashboardSidebar
    id="admin-sidebar"
    collapsible
    resizable
    :menu="{
      title: 'Yönetim menüsü',
      description: 'Blog yönetimi sayfaları arasında geçiş yapın.'
    }"
  >
    <template #header="{ collapsed }">
      <NuxtLink
        to="/admin/dashboard"
        class="flex items-center gap-2 font-semibold text-highlighted"
        :class="collapsed ? 'justify-center' : ''"
      >
        <span
          v-if="!collapsed"
          class="truncate"
        >
          Blog Admin
        </span>
        <UIcon
          v-else
          name="i-lucide-layout-dashboard"
          class="size-5"
        />
      </NuxtLink>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="navItems"
        orientation="vertical"
      />
    </template>
  </UDashboardSidebar>
</template>
