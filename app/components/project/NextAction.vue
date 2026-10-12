<script lang="ts" setup>
// Bloco do topo da página do projeto. Mostra a próxima ação marcada ou, sem
// marcação, a primeira tarefa aberta como sugestão (mesma regra da Home).
defineProps<{
  task: {
    id: string;
    title: string;
    is_next_action: boolean;
    implementation_intention: string | null;
  };
}>();
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
      <!-- "Quando e onde vou fazer": só existe para a próxima ação marcada. -->
      <AppInlineInput
        v-if="task.is_next_action"
        :value="task.implementation_intention ?? ''"
        :save="
          (value) => updateTask(task.id, { implementation_intention: value })
        "
        aria-label="Quando e onde vou fazer"
        class="mt-2"
        maxlength="200"
        placeholder="Quando e onde? Ex.: depois do almoço, no escritório"
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
