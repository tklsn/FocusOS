<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"

import { FocusIcon, Inbox, Settings, Sun } from "@lucide/vue"

const props = withDefaults(defineProps<SidebarProps>(), { variant: "inset" })

const navMain = [
  { title: "Hoje", url: "/", icon: Sun },
  { title: "Inbox", url: "/inbox", icon: Inbox },
]
const navFooter = [{ title: "Configurações", url: "/settings", icon: Settings }]
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
    </SidebarContent>
    <SidebarFooter>
      <NavMain :items="navFooter" />
    </SidebarFooter>
  </Sidebar>
</template>
