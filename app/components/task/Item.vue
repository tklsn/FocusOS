<script lang="ts" setup>
import { StickyNote, Trash2 } from "@lucide/vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  task: { id: string; title: string; notes: string | null; created_at: string };
}>();

const emit = defineEmits<{
  (e: "saved"): void;
  (e: "delete"): void;
}>();

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

  try {
    await $fetch(`/api/tasks/${props.task.id}`, {
      method: "PATCH",
      body: { [field]: value },
    });
    emit("saved");
  } catch {
    model.value = saved;
    toast.error("Não foi possível salvar. Tente novamente.");
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
      <Input
        v-model="title"
        aria-label="Título da tarefa"
        class="border-transparent bg-transparent shadow-none hover:border-input dark:bg-transparent"
        @blur="save('title')"
        @keydown.enter="blur"
        @keydown.esc="cancelTitle"
      />
      <span class="shrink-0 text-xs text-muted-foreground">
        {{ formatCreatedAt(task.created_at) }}
      </span>
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
        @click="$emit('delete')"
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
