<script lang="ts" setup>
import { Shapes } from "@lucide/vue";
import { toast } from "vue-sonner";

const { data: areas, status, error, refresh } = useAreas();
const { data: projects, refresh: refreshProjects } = useProjects();

const newName = ref("");
const creating = ref(false);

async function createAreas(items: { name: string }[]) {
  if (creating.value) return;
  creating.value = true;
  try {
    // em sequência para manter a ordem de criação
    for (const body of items) {
      await $fetch("/api/areas", { method: "POST", body });
    }
    newName.value = "";
  } catch {
    toast.error("Não foi possível criar a área. Tente novamente.");
  } finally {
    creating.value = false;
    refresh();
  }
}

function createArea() {
  const name = newName.value.trim();
  if (name) createAreas([{ name }]);
}

// Área com projetos: decisão explícita em vez de "Desfazer".
const confirming = ref<{ id: string; name: string; projects: number }>();
const confirmOpen = ref(false);

function deleteArea(id: string, name: string) {
  const count =
    projects.value?.filter((project) => project.area_id === id).length ?? 0;
  if (count > 0) {
    confirming.value = { id, name, projects: count };
    confirmOpen.value = true;
    return;
  }

  pendingAreaDeletes.add(id);
  areas.value = areas.value?.filter((area) => area.id !== id);

  toastUndo(
    "Área excluída",
    () => $fetch(`/api/areas/${id}`, { method: "DELETE" }),
    () => {
      pendingAreaDeletes.delete(id);
      refresh();
    },
  );
}

async function deleteAreaWithProjects() {
  const id = confirming.value?.id;
  if (!id) return;
  try {
    await $fetch(`/api/areas/${id}`, {
      method: "DELETE",
      query: { cascade: true },
    });
    toast("Área e projetos excluídos");
  } catch {
    toast.error("Não foi possível excluir a área. Tente novamente.");
  }
  refresh();
  refreshProjects();
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="font-heading">
      <h1 class="text-4xl font-bold">Áreas</h1>
      <p class="text-xl text-muted-foreground">
        Os contextos da sua vida, cada um com seus projetos.
      </p>
    </header>

    <form class="flex gap-2" @submit.prevent="createArea">
      <Input
        v-model="newName"
        aria-label="Nome da nova área"
        placeholder="Nova área"
      />
      <Button type="submit" :disabled="creating">Criar</Button>
    </form>

    <div
      v-if="status === 'pending' && !areas"
      role="status"
      class="flex flex-col gap-2"
    >
      <span class="sr-only">Carregando áreas…</span>
      <Skeleton v-for="i in 4" :key="i" class="h-10 w-full" />
    </div>

    <ul
      v-else-if="areas && areas.length > 0"
      class="flex flex-col divide-y rounded-lg border bg-card"
    >
      <AreaItem
        v-for="area in areas"
        :key="area.id"
        :area="area"
        @delete="deleteArea(area.id, area.name)"
      />
    </ul>

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar as áreas.</EmptyTitle>
        <EmptyDescription>Suas áreas continuam salvas.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refresh()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Shapes />
        </EmptyMedia>
        <EmptyTitle>Nenhuma área ainda.</EmptyTitle>
        <EmptyDescription>
          Crie as suas no campo acima ou comece pelas sugeridas: Trabalho,
          Pesquisa, Mestrado e Pessoal.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          :disabled="creating"
          @click="createAreas(DEFAULT_AREAS)"
        >
          Usar áreas sugeridas
        </Button>
      </EmptyContent>
    </Empty>

    <AlertDialog v-model:open="confirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Excluir "{{ confirming?.name }}" e seus projetos?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta área tem {{ confirming?.projects }}
            {{ confirming?.projects === 1 ? "projeto" : "projetos" }}. Eles
            serão excluídos junto, e não dá para desfazer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter área</AlertDialogCancel>
          <AlertDialogAction @click="deleteAreaWithProjects">
            Excluir área e projetos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
