<script lang="ts" setup>
import { Check, ChevronRight, Pencil, Play, Sun } from "@lucide/vue";
import { useNow } from "@vueuse/core";
import { toast } from "vue-sonner";

const now = useNow({ interval: 60_000 });
const today = computed(() =>
  now.value.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

const {
  data: todayTasks,
  status: todayStatus,
  error: todayError,
  refresh: refreshToday,
} = useTodayTasks();
const {
  data: actions,
  status: suggestionStatus,
  error: suggestionError,
  refresh: refreshSuggestions,
} = useNextActions();
const { data: projects } = useProjects();
const { data: areas } = useAreas();
const { data: inboxTasks } = useInboxTasks();

const decorate = (task: NonNullable<typeof actions.value>[number]) => {
  const project = projects.value?.find(
    (project) => project.id === task.project_id,
  );
  const area = areas.value?.find((area) => area.id === project?.area_id);
  return { task, project, area };
};

const todayItems = computed(() => (todayTasks.value ?? []).map(decorate));
const suggestionItems = computed(() =>
  (actions.value ?? [])
    .filter(
      (task) =>
        !todayItems.value.some(
          ({ task: todayTask }) => todayTask.id === task.id,
        ),
    )
    .map(decorate),
);
const focusedId = ref<string | null>(null);
const highlight = computed(
  () =>
    todayItems.value.find(({ task }) => task.id === focusedId.value) ??
    todayItems.value[0] ??
    suggestionItems.value[0],
);
const isSuggestion = computed(() => todayItems.value.length === 0);
const laterToday = computed(() =>
  todayItems.value.filter(({ task }) => task.id !== highlight.value?.task.id),
);
const moreSuggestions = computed(() =>
  isSuggestion.value ? suggestionItems.value.slice(1) : suggestionItems.value,
);
// Os dois blocos recolhidos: o resto de hoje e as sugestões fora do destaque.
const lists = computed(() =>
  [
    {
      label: `Depois, hoje: ${laterToday.value.length}`,
      items: laterToday.value,
      today: true,
    },
    {
      label: `Sugestões: ${moreSuggestions.value.length}`,
      items: moreSuggestions.value,
      today: false,
    },
  ].filter((list) => list.items.length > 0),
);
const pending = computed(
  () =>
    (todayStatus.value === "pending" && !todayTasks.value) ||
    (suggestionStatus.value === "pending" && !actions.value),
);
const error = computed(() => todayError.value || suggestionError.value);
const refreshHome = () => {
  refreshToday();
  refreshSuggestions();
};
watch(() => now.value.toDateString(), refreshHome);

const focusLink = (taskId: string) => ({
  path: "/focus",
  query: { task: taskId },
});

// Edição da ação principal: título da tarefa e nota "onde eu parei" do projeto.
const editOpen = ref(false);
const editTitle = ref("");
const editNote = ref("");
const saving = ref(false);

function openEdit() {
  editTitle.value = highlight.value?.task.title ?? "";
  editNote.value = highlight.value?.project?.resume_note ?? "";
  editOpen.value = true;
}

async function saveEdit() {
  const current = highlight.value;
  const title = editTitle.value.trim();
  const note = editNote.value.trim();
  if (!current || !title || saving.value) return;

  saving.value = true;
  try {
    if (title !== current.task.title) {
      await $fetch(`/api/tasks/${current.task.id}`, {
        method: "PATCH",
        body: { title },
      });
    }
    if (current.project && note !== (current.project.resume_note ?? "")) {
      await $fetch(`/api/projects/${current.project.id}`, {
        method: "PATCH",
        body: { resume_note: note },
      });
    }
    editOpen.value = false;
  } catch {
    toast.error("Não foi possível salvar. Tente novamente.");
  } finally {
    saving.value = false;
    refreshHome();
    refreshNuxtData("projects");
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col gap-10">
    <h1
      class="font-heading text-sm text-muted-foreground first-letter:uppercase"
    >
      Hoje, {{ today }}
    </h1>

    <div v-if="pending" role="status" class="flex flex-col gap-4">
      <span class="sr-only">Carregando a próxima ação…</span>
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-12 w-44" />
    </div>

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar a próxima ação.</EmptyTitle>
        <EmptyDescription>Suas tarefas continuam salvas.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refreshHome()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

    <section
      v-else-if="highlight"
      aria-labelledby="highlight-heading"
      class="flex flex-col gap-4"
    >
      <p v-if="isSuggestion" class="text-xs font-medium text-muted-foreground">
        Sugestão
      </p>

      <NuxtLink
        v-if="highlight.project"
        :to="`/projects/${highlight.project.id}`"
        class="inline-flex items-center gap-2 self-start rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <component
          :is="AREA_ICON_STYLES[highlight.area.icon].component"
          v-if="highlight.area"
          class="size-4"
          :class="AREA_COLOR_STYLES[highlight.area.color].text"
        />
        {{ highlight.project.name }}
      </NuxtLink>

      <h2
        id="highlight-heading"
        class="font-heading text-3xl leading-tight font-bold text-balance break-words sm:text-4xl"
      >
        {{ highlight.task.title }}
      </h2>

      <div v-if="highlight.project?.resume_note" class="flex gap-3">
        <span
          aria-hidden="true"
          class="w-0.5 shrink-0 rounded-full"
          :class="
            highlight.area
              ? AREA_COLOR_STYLES[highlight.area.color].bg
              : 'bg-border'
          "
        />
        <p class="line-clamp-3 text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Onde você parou:</span>
          {{ highlight.project.resume_note }}
        </p>
      </div>

      <div class="mt-2 flex flex-wrap gap-3">
        <Button size="lg" class="h-12 px-8 text-base" as-child>
          <NuxtLink :to="focusLink(highlight.task.id)">
            <Play />
            Iniciar Foco
          </NuxtLink>
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="h-12 text-base"
          @click="setTaskDone(highlight.task.id, true, refreshHome)"
        >
          <Check />
          Concluir
        </Button>
        <Button
          variant="ghost"
          size="lg"
          class="h-12 text-base text-muted-foreground"
          @click="openEdit"
        >
          <Pencil />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="lg"
          class="h-12 text-base text-muted-foreground"
          @click="setTaskToday(highlight.task.id, isSuggestion, refreshHome)"
        >
          <Sun />
          {{ isSuggestion ? "Fazer hoje" : "Tirar de hoje" }}
        </Button>
      </div>

      <Dialog v-model:open="editOpen">
        <DialogContent>
          <form class="flex flex-col gap-4" @submit.prevent="saveEdit">
            <DialogHeader>
              <DialogTitle>Editar tarefa</DialogTitle>
              <DialogDescription>
                A nota vale para o projeto inteiro e também aparece na página
                dele.
              </DialogDescription>
            </DialogHeader>
            <div class="flex flex-col gap-2">
              <Label for="edit-title">Tarefa</Label>
              <Input id="edit-title" v-model="editTitle" required />
            </div>
            <div v-if="highlight.project" class="flex flex-col gap-2">
              <Label for="edit-note">Onde você parou</Label>
              <Textarea
                id="edit-note"
                v-model="editNote"
                placeholder="O que você estava fazendo e qual é o próximo passo."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="editOpen = false">
                Cancelar
              </Button>
              <Button type="submit" :disabled="saving">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>

    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Sun />
        </EmptyMedia>
        <EmptyTitle>Hoje está livre.</EmptyTitle>
        <EmptyDescription>
          A próxima ação dos seus projetos ativos aparece aqui. Quando algo
          surgir, é só capturar abaixo, sem precisar organizar agora.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent v-if="inboxTasks?.length">
        <Button variant="outline" as-child>
          <NuxtLink to="/inbox">
            Triar a Inbox ({{ inboxTasks.length }})
          </NuxtLink>
        </Button>
      </EmptyContent>
    </Empty>

    <TaskFastAddInput>
      <template #message>
        <p class="text-sm text-muted-foreground">
          Use
          <Kbd>{{ isMac ? "⌘" : "Ctrl" }}</Kbd>
          <span>+</span>
          <Kbd>I</Kbd>
          para abrir este campo rapidamente de qualquer lugar.
        </p>
      </template>
    </TaskFastAddInput>

    <Collapsible
      v-for="list in lists"
      :key="String(list.today)"
      class="group/collapsible"
    >
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground">
          <ChevronRight
            class="transition-transform group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none"
          />
          {{ list.label }}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ItemGroup class="mt-2">
          <Item
            v-for="{ task, project, area } in list.items"
            :key="task.id"
            size="sm"
            class="px-0"
          >
            <ItemMedia v-if="area">
              <component
                :is="AREA_ICON_STYLES[area.icon].component"
                class="size-4"
                :class="AREA_COLOR_STYLES[area.color].text"
              />
            </ItemMedia>
            <ItemContent class="min-w-0">
              <ItemTitle class="max-w-full truncate">{{
                task.title
              }}</ItemTitle>
              <ItemDescription v-if="project">
                <NuxtLink :to="`/projects/${project.id}`">
                  {{ project.name }}
                </NuxtLink>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                v-if="list.today"
                variant="ghost"
                size="sm"
                @click="focusedId = task.id"
              >
                <Play />
                Focar
              </Button>
              <Button
                variant="ghost"
                :size="list.today ? 'icon-sm' : 'sm'"
                :class="list.today && 'text-primary'"
                @click="setTaskToday(task.id, !list.today, refreshHome)"
              >
                <Sun :fill="list.today ? 'currentColor' : 'none'" />
                <span :class="list.today && 'sr-only'">
                  {{
                    list.today ? `Tirar ${task.title} de hoje` : "Fazer hoje"
                  }}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                class="text-muted-foreground"
                @click="setTaskDone(task.id, true, refreshHome)"
              >
                <Check />
                <span class="sr-only">Concluir {{ task.title }}</span>
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
