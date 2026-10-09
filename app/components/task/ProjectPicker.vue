<script lang="ts" setup>
import { FolderInput } from "@lucide/vue";

type Project = { id: string; name: string };

const emit = defineEmits<{
  (e: "select", project: Project): void;
}>();

const open = ref(false);
const { data: areas } = useAreas();
const { data: projects } = useProjects();

const groups = computed(() =>
  (areas.value ?? [])
    .map((area) => ({
      area,
      projects: (projects.value ?? []).filter(
        (project) => project.area_id === area.id && project.status === "active",
      ),
    }))
    .filter((group) => group.projects.length > 0),
);

function select(project: Project) {
  open.value = false;
  emit("select", project);
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon-sm" class="text-muted-foreground">
        <FolderInput />
        <span class="sr-only">Mover para projeto</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="w-64 p-0">
      <Command>
        <CommandInput placeholder="Buscar projeto…" />
        <CommandList>
          <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
          <p
            v-if="groups.length === 0"
            class="p-4 text-sm text-muted-foreground"
          >
            Nenhum projeto ativo ainda. Crie um dentro de uma área.
          </p>
          <CommandGroup
            v-for="group in groups"
            :key="group.area.id"
            :heading="group.area.name"
          >
            <CommandItem
              v-for="project in group.projects"
              :key="project.id"
              :value="project.id"
              @select="select(project)"
            >
              {{ project.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
