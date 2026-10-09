<script lang="ts" setup>
import { Check, ChevronRight, Pencil, Play, Sun } from "@lucide/vue";
import { toast } from "vue-sonner";

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const { data: actions, status, error, refresh } = useNextActions();
const { data: projects } = useProjects();
const { data: areas } = useAreas();
const { data: inboxTasks } = useInboxTasks();

// Cada próxima ação com o projeto e a área a que pertence.
const items = computed(() =>
  (actions.value ?? []).map((task) => {
    const project = projects.value?.find(
      (project) => project.id === task.project_id,
    );
    const area = areas.value?.find((area) => area.id === project?.area_id);
    return { task, project, area };
  }),
);
// Uma por vez: a primeira ocupa a tela, as outras ficam recolhidas.
const now = computed(() => items.value[0]);
const later = computed(() => items.value.slice(1));

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
  editTitle.value = now.value?.task.title ?? "";
  editNote.value = now.value?.project?.resume_note ?? "";
  editOpen.value = true;
}

async function saveEdit() {
  const current = now.value;
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
    refresh();
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

    <div
      v-if="status === 'pending' && !actions"
      role="status"
      class="flex flex-col gap-4"
    >
      <span class="sr-only">Carregando a próxima ação…</span>
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-12 w-44" />
    </div>

    <section
      v-else-if="now"
      aria-labelledby="now-heading"
      class="flex flex-col gap-4"
    >
      <NuxtLink
        v-if="now.project"
        :to="`/projects/${now.project.id}`"
        class="inline-flex items-center gap-2 self-start rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <component
          :is="AREA_ICON_STYLES[now.area.icon].component"
          v-if="now.area"
          class="size-4"
          :class="AREA_COLOR_STYLES[now.area.color].text"
        />
        {{ now.project.name }}
      </NuxtLink>

      <h2
        id="now-heading"
        class="font-heading text-3xl leading-tight font-bold text-balance break-words sm:text-4xl"
      >
        {{ now.task.title }}
      </h2>

      <div v-if="now.project?.resume_note" class="flex gap-3">
        <span
          aria-hidden="true"
          class="w-0.5 shrink-0 rounded-full"
          :class="now.area ? AREA_COLOR_STYLES[now.area.color].bg : 'bg-border'"
        />
        <p class="line-clamp-3 text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Onde você parou:</span>
          {{ now.project.resume_note }}
        </p>
      </div>

      <div class="mt-2 flex flex-wrap gap-3">
        <Button size="lg" class="h-12 px-8 text-base" as-child>
          <NuxtLink :to="focusLink(now.task.id)">
            <Play />
            Iniciar Foco
          </NuxtLink>
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="h-12 text-base"
          @click="setTaskDone(now.task.id, true, refresh)"
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
      </div>

      <Dialog v-model:open="editOpen">
        <DialogContent>
          <form class="flex flex-col gap-4" @submit.prevent="saveEdit">
            <DialogHeader>
              <DialogTitle>Editar próxima ação</DialogTitle>
              <DialogDescription>
                A nota vale para o projeto inteiro e também aparece na página
                dele.
              </DialogDescription>
            </DialogHeader>
            <div class="flex flex-col gap-2">
              <Label for="edit-title">Tarefa</Label>
              <Input id="edit-title" v-model="editTitle" required />
            </div>
            <div v-if="now.project" class="flex flex-col gap-2">
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

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar a próxima ação.</EmptyTitle>
        <EmptyDescription>Suas tarefas continuam salvas.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refresh()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

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

    <Collapsible v-if="later.length > 0" class="group/collapsible">
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground">
          <ChevronRight
            class="transition-transform group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none"
          />
          Depois, em
          {{
            later.length === 1
              ? "outro projeto"
              : `outros ${later.length} projetos`
          }}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ItemGroup class="mt-2">
          <Item
            v-for="{ task, project, area } in later"
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
              <Button variant="ghost" size="sm" as-child>
                <NuxtLink :to="focusLink(task.id)">
                  <Play />
                  Focar
                </NuxtLink>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                class="text-muted-foreground"
                @click="setTaskDone(task.id, true, refresh)"
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
