<script lang="ts" setup>
import { Inbox } from "@lucide/vue";
import { toast } from "vue-sonner";

const { data: tasks, status, error, refresh } = useInboxTasks();

function deleteTask(id: string) {
  pendingInboxDeletes.add(id);
  tasks.value = tasks.value?.filter((task) => task.id !== id);

  let settled = false;
  const settle = async (undo: boolean) => {
    if (settled) return;
    settled = true;
    try {
      if (!undo) await $fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch {
      toast.error("Não foi possível excluir. A tarefa voltou para a Inbox.");
    }
    pendingInboxDeletes.delete(id);
    refresh();
  };

  toast("Tarefa excluída", {
    duration: 5000,
    action: { label: "Desfazer", onClick: () => settle(true) },
    onAutoClose: () => settle(false),
    onDismiss: () => settle(false),
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="font-heading">
      <h1 class="text-4xl font-bold">Inbox</h1>
      <p class="text-xl text-muted-foreground">
        Tudo que foi capturado e ainda não foi triado.
      </p>
    </header>

    <div v-if="status === 'pending' && !tasks" role="status" class="flex flex-col gap-2">
      <span class="sr-only">Carregando tarefas…</span>
      <Skeleton v-for="i in 4" :key="i" class="h-10 w-full" />
    </div>

    <ul v-else-if="tasks && tasks.length > 0" class="flex flex-col divide-y rounded-lg border bg-card">
      <TaskInboxItem v-for="task in tasks" :key="task.id" :task="task" @delete="deleteTask(task.id)" />
    </ul>

    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar a Inbox.</EmptyTitle>
        <EmptyDescription>Suas tarefas continuam salvas.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" @click="refresh()">Tentar de novo</Button>
      </EmptyContent>
    </Empty>

    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Tudo capturado.</EmptyTitle>
        <EmptyDescription>Respire.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
