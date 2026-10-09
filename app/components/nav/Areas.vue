<script setup lang="ts">
import { Archive, ChevronRight, Shapes } from "@lucide/vue";

const { data: areas } = useAreas();
const { data: projects } = useProjects();
const route = useRoute();

const projectsByArea = computed(() =>
  Object.groupBy(
    (projects.value ?? []).filter((project) => project.status === "active"),
    (project) => project.area_id,
  ),
);
const inactiveProjects = computed(() =>
  (projects.value ?? []).filter((project) => project.status !== "active"),
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
      <Collapsible
        v-if="inactiveProjects.length > 0"
        as-child
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton tooltip="Pausados e concluídos">
              <Archive />
              <span>Pausados e concluídos</span>
              <ChevronRight
                class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem
                v-for="project in inactiveProjects"
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
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
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
