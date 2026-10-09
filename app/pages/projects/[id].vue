<script lang="ts" setup>
import { ChevronDown, ChevronRight, ChevronUp, ListTodo } from "@lucide/vue";
import { toast } from "vue-sonner";

const id = useRoute().params.id as string;
const { data: areas } = useAreas();
const { data: projects, status: projectsStatus } = useProjects();
const { data: tasks, status, error, refresh } = useProjectTasks(id);

const project = computed(() =>
  projects.value?.find((project) => project.id === id),
);
const area = computed(() =>
  areas.value?.find((area) => area.id === project.value?.area_id),
);
const loading = computed(
  () =>
    (projectsStatus.value === "pending" && !projects.value) ||
    (status.value === "pending" && !tasks.value),
);

const openTasks = computed(
  () => tasks.value?.filter((task) => task.status !== "done") ?? [],
);
const doneTasks = computed(() =>
  (tasks.value ?? [])
    .filter((task) => task.status === "done")
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? "")),
);
const resumeNote = ref("");
watch(
  () => project.value?.resume_note,
  (note) => (resumeNote.value = note ?? ""),
  { immediate: true },
);

async function patchProject(body: {
  status?: keyof typeof PROJECT_STATUS_LABELS;
  resume_note?: string;
}) {
  try {
    await $fetch(`/api/projects/${id}`, { method: "PATCH", body });
    await refreshNuxtData("projects");
  } catch {
    resumeNote.value = project.value?.resume_note ?? "";
    toast.error("Não foi possível salvar. Tente novamente.");
  }
}

function saveResumeNote() {
  const value = resumeNote.value.trim();
  if (value !== (project.value?.resume_note ?? "")) {
    patchProject({ resume_note: value });
  }
}

async function move(event: MouseEvent, index: number, delta: -1 | 1) {
  const list = [...openTasks.value];
  const target = index + delta;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target]!, list[index]!];
  tasks.value = [...list, ...doneTasks.value];

  // o item muda de lugar no DOM; devolve o foco ao botão para mover de novo pelo teclado
  const button = event.currentTarget as HTMLElement;
  nextTick(() => button.focus());

  try {
    await $fetch(`/api/projects/${id}/tasks/order`, {
      method: "PUT",
      body: { ids: list.map((task) => task.id) },
    });
  } catch {
    toast.error("Não foi possível reordenar. Tente novamente.");
    refresh();
  }
}

function deleteTask(taskId: string) {
  pendingTaskDeletes.add(taskId);
  tasks.value = tasks.value?.filter((task) => task.id !== taskId);

  toastUndo(
    "Tarefa excluída",
    () => $fetch(`/api/tasks/${taskId}`, { method: "DELETE" }),
    () => {
      pendingTaskDeletes.delete(taskId);
      refresh();
    },
  );
}
</script>

<template>
  <div v-if="loading" role="status" class="flex flex-col gap-4">
    <span class="sr-only">Carregando projeto…</span>
    <Skeleton class="h-10 w-1/2" />
    <Skeleton v-for="i in 3" :key="i" class="h-10 w-full" />
  </div>

  <Empty v-else-if="!project">
    <EmptyHeader>
      <EmptyTitle>Projeto não encontrado.</EmptyTitle>
      <EmptyDescription>Ele pode ter sido excluído.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" as-child>
        <NuxtLink to="/areas">Ver áreas</NuxtLink>
      </Button>
    </EmptyContent>
  </Empty>

  <div v-else class="flex flex-col gap-4">
    <header class="font-heading">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-4xl font-bold">{{ project.name }}</h1>
        <NativeSelect
          aria-label="Status do projeto"
          class="font-sans"
          :model-value="project.status"
          @update:model-value="(status) => patchProject({ status })"
        >
          <NativeSelectOption
            v-for="(label, value) in PROJECT_STATUS_LABELS"
            :key="value"
            :value="value"
          >
            {{ label }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
      <p v-if="area" class="text-xl text-muted-foreground">
        <NuxtLink
          :to="`/areas/${area.id}`"
          class="inline-flex items-center gap-2 hover:underline"
        >
          <component
            :is="AREA_ICON_STYLES[area.icon].component"
            class="size-5"
            :class="AREA_COLOR_STYLES[area.color].text"
          />
          {{ area.name }}
        </NuxtLink>
      </p>
    </header>

    <section
      class="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4"
    >
      <label for="resume-note" class="font-heading font-semibold">
        Onde eu parei
      </label>
      <Textarea
        id="resume-note"
        v-model="resumeNote"
        class="bg-background"
        placeholder="O que você estava fazendo e qual é o próximo passo, para retomar sem esforço."
        @blur="saveResumeNote"
      />
      <p
        v-if="project.resume_note_updated_at"
        class="text-xs text-muted-foreground"
      >
        Última edição: {{ formatCreatedAt(project.resume_note_updated_at) }}
      </p>
    </section>

    <TaskFastAddInput :project-id="id" @created="refresh()" />

    <ul
      v-if="openTasks.length > 0"
      class="flex flex-col divide-y rounded-lg border bg-card"
    >
      <TaskItem
        v-for="(task, index) in openTasks"
        :key="task.id"
        :task="task"
        @saved="refresh()"
        @delete="deleteTask(task.id)"
      >
        <template #leading>
          <div class="flex flex-col">
            <Button
              variant="ghost"
              size="icon-xs"
              class="text-muted-foreground aria-disabled:opacity-30"
              :aria-disabled="index === 0"
              @click="move($event, index, -1)"
            >
              <ChevronUp />
              <span class="sr-only">Mover para cima</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              class="text-muted-foreground aria-disabled:opacity-30"
              :aria-disabled="index === openTasks.length - 1"
              @click="move($event, index, 1)"
            >
              <ChevronDown />
              <span class="sr-only">Mover para baixo</span>
            </Button>
          </div>
        </template>
      </TaskItem>
    </ul>

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar as tarefas.</EmptyTitle>
        <EmptyDescription>Suas tarefas continuam salvas.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refresh()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

    <Empty v-else-if="doneTasks.length === 0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListTodo />
        </EmptyMedia>
        <EmptyTitle>Projeto sem tarefas por enquanto.</EmptyTitle>
        <EmptyDescription>
          Adicione a primeira no campo acima. Um passo pequeno já serve.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <Collapsible v-if="doneTasks.length > 0" class="group/collapsible">
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="sm" class="text-muted-foreground">
          <ChevronRight
            class="transition-transform group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none"
          />
          Concluídas ({{ doneTasks.length }})
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul class="mt-2 flex flex-col divide-y rounded-lg border bg-card">
          <TaskItem
            v-for="task in doneTasks"
            :key="task.id"
            :task="task"
            @saved="refresh()"
            @delete="deleteTask(task.id)"
          />
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
