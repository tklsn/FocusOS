<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

import { FocusIcon, Inbox, Settings, Sun } from "@lucide/vue";

const props = withDefaults(defineProps<SidebarProps>(), { variant: "inset" });

const { data: inboxTasks } = useInboxTasks();

const navMain = computed(() => [
  { title: "Hoje", url: "/", icon: Sun },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
    badge: inboxTasks.value?.length ?? 0,
  },
]);
const navFooter = [
  { title: "Configurações", url: "/settings", icon: Settings },
];
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader :class="isDesktopMac && 'pt-10 [-webkit-app-region:drag]'">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/" class="[-webkit-app-region:no-drag]">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <FocusIcon class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">FocusOS</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
      <NavAreas />
    </SidebarContent>
    <SidebarFooter>
      <NavMain :items="navFooter" />
    </SidebarFooter>
  </Sidebar>
</template>
