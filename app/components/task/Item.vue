<script lang="ts" setup>
import { StickyNote, Sun, Trash2 } from "@lucide/vue";

const props = defineProps<{
  task: {
    id: string;
    title: string;
    notes: string | null;
    status: string;
    created_at: string;
    scheduled_for: string | null;
  };
}>();

const scheduledToday = computed(
  () =>
    !!props.task.scheduled_for &&
    isTodayOrBefore(new Date(props.task.scheduled_for)),
);

const title = ref(props.task.title);
const notes = ref(props.task.notes ?? "");
const showNotes = ref(false);

async function save(field: "title" | "notes") {
  const model = field === "title" ? title : notes;
  const value = model.value.trim();
  const saved = props.task[field] ?? "";

  if (field === "title" && !value) {
    title.value = saved;
    return;
  }
  if (value === saved) return;

  if (!(await updateTask(props.task.id, { [field]: value }))) {
    model.value = saved;
  }
}

function blur(e: KeyboardEvent) {
  (e.target as HTMLElement).blur();
}

function cancelTitle(e: KeyboardEvent) {
  title.value = props.task.title;
  blur(e);
}
</script>

<template>
  <li class="flex flex-col gap-2 px-2 py-2">
    <div class="flex items-center gap-2">
      <slot name="leading" />
      <Checkbox
        aria-label="Concluída"
        :model-value="task.status === 'done'"
        @update:model-value="(done) => setTaskDone(task.id, done === true)"
      />
      <Input
        v-model="title"
        aria-label="Título da tarefa"
        class="border-transparent bg-transparent shadow-none hover:border-input dark:bg-transparent"
        :class="task.status === 'done' && 'text-muted-foreground line-through'"
        @blur="save('title')"
        @keydown.enter="blur"
        @keydown.esc="cancelTitle"
      />
      <span class="shrink-0 text-xs text-muted-foreground">
        {{ formatCreatedAt(task.created_at) }}
      </span>
      <Button
        v-if="task.status !== 'done'"
        variant="ghost"
        size="icon-sm"
        :class="scheduledToday ? 'text-primary' : 'text-muted-foreground'"
        :aria-pressed="scheduledToday"
        @click="setTaskToday(task.id, !scheduledToday)"
      >
        <Sun :fill="scheduledToday ? 'currentColor' : 'none'" />
        <span class="sr-only">
          {{ scheduledToday ? "Tirar de hoje" : "Fazer hoje" }}
        </span>
      </Button>
      <slot name="actions" />
      <Button
        variant="ghost"
        size="icon-sm"
        :class="notes ? 'text-foreground' : 'text-muted-foreground'"
        :aria-expanded="showNotes"
        @click="showNotes = !showNotes"
      >
        <StickyNote />
        <span class="sr-only">Notas</span>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        class="text-muted-foreground"
        @click="deleteTask(task.id)"
      >
        <Trash2 />
        <span class="sr-only">Excluir</span>
      </Button>
    </div>
    <Textarea
      v-if="showNotes"
      v-model="notes"
      aria-label="Notas da tarefa"
      placeholder="Notas"
      @blur="save('notes')"
    />
  </li>
</template>
