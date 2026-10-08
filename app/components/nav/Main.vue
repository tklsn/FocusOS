<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";

defineProps<{
  items: { title: string; url: string; icon: LucideIcon; badge?: number }[];
}>();
const route = useRoute();
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.url">
        <SidebarMenuButton
          as-child
          :tooltip="item.title"
          :is-active="route.path === item.url"
        >
          <NuxtLink :to="item.url">
            <component :is="item.icon" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </SidebarMenuButton>
        <SidebarMenuBadge v-if="item.badge">
          {{ item.badge }}
          <span class="sr-only">tarefas</span>
        </SidebarMenuBadge>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
