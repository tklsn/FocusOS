<script setup lang="ts">
import { Shapes } from "@lucide/vue";

const { data: areas } = useAreas();
const { data: projects } = useProjects();
const route = useRoute();

const projectsByArea = computed(() =>
  Object.groupBy(projects.value ?? [], (project) => project.area_id),
);
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Áreas</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="area in areas" :key="area.id">
        <SidebarMenuButton
          as-child
          :tooltip="area.name"
          :is-active="route.path === `/areas/${area.id}`"
        >
          <NuxtLink :to="`/areas/${area.id}`">
            <component
              :is="AREA_ICON_STYLES[area.icon].component"
              :class="AREA_COLOR_STYLES[area.color].text"
            />
            <span>{{ area.name }}</span>
          </NuxtLink>
        </SidebarMenuButton>
        <SidebarMenuSub v-if="projectsByArea[area.id]">
          <SidebarMenuSubItem
            v-for="project in projectsByArea[area.id]"
            :key="project.id"
          >
            <SidebarMenuSubButton
              as-child
              :is-active="route.path === `/projects/${project.id}`"
            >
              <NuxtLink :to="`/projects/${project.id}`">
                <span>{{ project.name }}</span>
              </NuxtLink>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
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
