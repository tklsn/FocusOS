<script setup lang="ts">
import { Shapes } from "@lucide/vue";

const { data: areas } = useAreas();
const route = useRoute();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Áreas</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="area in areas" :key="area.id">
        <SidebarMenuButton as-child :tooltip="area.name">
          <NuxtLink :to="{ path: '/areas', hash: `#area-${area.id}` }">
            <component
              :is="AREA_ICON_STYLES[area.icon].component"
              :class="AREA_COLOR_STYLES[area.color].text"
            />
            <span>{{ area.name }}</span>
          </NuxtLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          as-child
          tooltip="Gerenciar áreas"
          :is-active="route.path === '/areas'"
        >
          <NuxtLink to="/areas">
            <Shapes />
            <span>Gerenciar áreas</span>
          </NuxtLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
