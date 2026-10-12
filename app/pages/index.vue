<script lang="ts" setup>
import { Check, Pencil, Play, Sun } from "@lucide/vue";
import { useNow } from "@vueuse/core";

const now = useNow({ interval: 60_000 });
const today = computed(() =>
  now.value.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);
// virou o dia com o app aberto: o que era de ontem passa a ser de hoje
watch(() => now.value.toDateString(), refreshTasks);

const {
  data: todayTasks,
  status: todayStatus,
  error: todayError,
} = useTodayTasks();
const {
  data: nextActions,
  status: nextActionsStatus,
  error: nextActionsError,
} = useNextActions();
const { data: projects } = useProjects();
const { data: areas } = useAreas();
const { data: inboxTasks } = useInboxTasks();

const pending = computed(
  () =>
    (todayStatus.value === "pending" && !todayTasks.value) ||
    (nextActionsStatus.value === "pending" && !nextActions.value),
);
const error = computed(() => todayError.value || nextActionsError.value);

// Tarefa escolhida com "Focar" na lista de hoje.
const focusedId = ref<string | null>(null);
const plan = computed(() =>
  planHome(todayTasks.value ?? [], nextActions.value ?? [], focusedId.value),
);
const isSuggestion = computed(() => plan.value.isSuggestion);

// A tela mostra cada tarefa junto do projeto e da área dela.
const withProject = (task: NonNullable<typeof todayTasks.value>[number]) => {
  const project = projects.value?.find(
    (project) => project.id === task.project_id,
  );
  const area = areas.value?.find((area) => area.id === project?.area_id);
  return { task, project, area };
};

const highlight = computed(
  () => plan.value.highlight && withProject(plan.value.highlight),
);
// Os dois blocos recolhidos: o resto de hoje e as sugestões fora do destaque.
const lists = computed(() =>
  [
    {
      label: `Depois, hoje: ${plan.value.laterToday.length}`,
      items: plan.value.laterToday.map(withProject),
      today: true,
    },
    {
      label: `Sugestões: ${plan.value.moreSuggestions.length}`,
      items: plan.value.moreSuggestions.map(withProject),
      today: false,
    },
  ].filter((list) => list.items.length > 0),
);

const focusLink = (taskId: string) => ({
  path: "/focus",
  query: { task: taskId },
});

const editOpen = ref(false);
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

    <AppLoadError
      v-else-if="error"
      title="Não foi possível carregar a próxima ação."
      description="Suas tarefas continuam salvas."
      @retry="refreshTasks()"
    />

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
        <AreaIcon v-if="highlight.area" :area="highlight.area" class="size-4" />
        {{ highlight.project.name }}
      </NuxtLink>

      <h2
        id="highlight-heading"
        class="font-heading text-3xl leading-tight font-bold text-balance break-words sm:text-4xl"
      >
        {{ highlight.task.title }}
      </h2>

      <p
        v-if="
          highlight.task.is_next_action &&
          highlight.task.implementation_intention
        "
        class="text-sm text-muted-foreground"
      >
        {{ highlight.task.implementation_intention }}
      </p>

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
          @click="setTaskDone(highlight.task.id, true)"
        >
          <Check />
          Concluir
        </Button>
        <Button
          variant="ghost"
          size="lg"
          class="h-12 text-base text-muted-foreground"
          @click="editOpen = true"
        >
          <Pencil />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="lg"
          class="h-12 text-base text-muted-foreground"
          @click="setTaskToday(highlight.task.id, isSuggestion)"
        >
          <Sun />
          {{ isSuggestion ? "Fazer hoje" : "Tirar de hoje" }}
        </Button>
      </div>

      <TaskEditDialog
        v-model:open="editOpen"
        :task="highlight.task"
        :project="highlight.project"
      />
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

    <HomeTaskList
      v-for="list in lists"
      :key="String(list.today)"
      :label="list.label"
      :items="list.items"
      :today="list.today"
      @focus="focusedId = $event"
    />
  </div>
</template>
