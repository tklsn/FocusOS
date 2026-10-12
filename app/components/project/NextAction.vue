<script lang="ts" setup>
// Bloco do topo da página do projeto. Mostra a próxima ação marcada ou, sem
// marcação, a primeira tarefa aberta como sugestão (mesma regra da Home).
const props = defineProps<{
  task: {
    id: string;
    title: string;
    is_next_action: boolean;
    implementation_intention: string | null;
  };
}>();

// "Quando e onde vou fazer": só existe para a próxima ação marcada.
const intention = ref("");
watch(
  () => props.task,
  (task) => (intention.value = task.implementation_intention ?? ""),
  { immediate: true },
);

function saveIntention() {
  const value = intention.value.trim();
  if (value !== (props.task.implementation_intention ?? "")) {
    updateTask(props.task.id, { implementation_intention: value });
  }
}

function blur(e: KeyboardEvent) {
  (e.target as HTMLElement).blur();
}
</script>

<template>
  <section
    aria-labelledby="next-action-heading"
    class="flex items-center gap-3 rounded-lg border bg-card p-4"
  >
    <Checkbox
      aria-label="Concluir próxima ação"
      :model-value="false"
      @update:model-value="setTaskDone(task.id, true)"
    />
    <div class="min-w-0 flex-1">
      <h2
        id="next-action-heading"
        class="text-xs font-medium text-muted-foreground"
      >
        {{ task.is_next_action ? "Próxima ação" : "Sugestão de próxima ação" }}
      </h2>
      <p class="truncate font-heading text-lg font-semibold">
        {{ task.title }}
      </p>
      <Input
        v-if="task.is_next_action"
        v-model="intention"
        aria-label="Quando e onde vou fazer"
        class="mt-2"
        maxlength="200"
        placeholder="Quando e onde? Ex.: depois do almoço, no escritório"
        @blur="saveIntention"
        @keydown.enter="blur"
      />
    </div>
    <Button
      v-if="!task.is_next_action"
      variant="outline"
      size="sm"
      @click="updateTask(task.id, { is_next_action: true })"
    >
      Definir como próxima ação
    </Button>
  </section>
</template>
