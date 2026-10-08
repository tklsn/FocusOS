<script lang="ts" setup>
import { FolderOpen } from "@lucide/vue";
import { toast } from "vue-sonner";

const route = useRoute();
const { data: areas, status: areasStatus } = useAreas();
const { data: projects, status, error, refresh } = useProjects();

const area = computed(() =>
  areas.value?.find((area) => area.id === route.params.id),
);
const areaProjects = computed(
  () =>
    projects.value?.filter((project) => project.area_id === route.params.id) ??
    [],
);
const loading = computed(
  () =>
    (areasStatus.value === "pending" && !areas.value) ||
    (status.value === "pending" && !projects.value),
);

const newName = ref("");
const creating = ref(false);

async function createProject() {
  const name = newName.value.trim();
  if (!name || creating.value) return;
  creating.value = true;
  try {
    await $fetch("/api/projects", {
      method: "POST",
      body: { area_id: route.params.id, name },
    });
    newName.value = "";
    refresh();
  } catch {
    toast.error("Não foi possível criar o projeto. Tente novamente.");
  } finally {
    creating.value = false;
  }
}

function deleteProject(id: string) {
  pendingProjectDeletes.add(id);
  projects.value = projects.value?.filter((project) => project.id !== id);

  toastUndo(
    "Projeto excluído. As tarefas dele voltam para a Inbox.",
    () => $fetch(`/api/projects/${id}`, { method: "DELETE" }),
    () => {
      pendingProjectDeletes.delete(id);
      refresh();
      refreshNuxtData("inbox-tasks");
    },
  );
}
</script>

<template>
  <div v-if="loading" role="status" class="flex flex-col gap-4">
    <span class="sr-only">Carregando área…</span>
    <Skeleton class="h-10 w-1/2" />
    <Skeleton v-for="i in 3" :key="i" class="h-10 w-full" />
  </div>

  <Empty v-else-if="!area">
    <EmptyHeader>
      <EmptyTitle>Área não encontrada.</EmptyTitle>
      <EmptyDescription>Ela pode ter sido excluída.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" as-child>
        <NuxtLink to="/areas">Ver áreas</NuxtLink>
      </Button>
    </EmptyContent>
  </Empty>

  <div v-else class="flex flex-col gap-4">
    <header class="font-heading">
      <h1 class="flex items-center gap-3 text-4xl font-bold">
        <component
          :is="AREA_ICON_STYLES[area.icon].component"
          class="size-8"
          :class="AREA_COLOR_STYLES[area.color].text"
        />
        {{ area.name }}
      </h1>
      <p class="text-xl text-muted-foreground">Projetos desta área.</p>
    </header>

    <form class="flex gap-2" @submit.prevent="createProject">
      <Input
        v-model="newName"
        aria-label="Nome do novo projeto"
        placeholder="Novo projeto"
      />
      <Button type="submit" :disabled="creating">Criar</Button>
    </form>

    <ul
      v-if="areaProjects.length > 0"
      class="flex flex-col divide-y rounded-lg border bg-card"
    >
      <ProjectItem
        v-for="project in areaProjects"
        :key="project.id"
        :project="project"
        @delete="deleteProject(project.id)"
      />
    </ul>

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar os projetos.</EmptyTitle>
        <EmptyDescription>Seus projetos continuam salvos.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refresh()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>Nenhum projeto nesta área ainda.</EmptyTitle>
        <EmptyDescription>
          Crie o primeiro no campo acima, quando quiser.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
