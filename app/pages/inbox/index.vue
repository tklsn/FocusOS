<script lang="ts" setup>
import { Inbox } from "@lucide/vue";
import { toast } from "vue-sonner";

const { data: tasks, status, error, refresh } = useInboxTasks();

async function moveToProject(
  taskId: string,
  project: { id: string; name: string },
) {
  if (await updateTask(taskId, { project_id: project.id })) {
    toast(`Movida para ${project.name}`);
  }
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

    <div
      v-if="status === 'pending' && !tasks"
      role="status"
      class="flex flex-col gap-2"
    >
      <span class="sr-only">Carregando tarefas…</span>
      <Skeleton v-for="i in 4" :key="i" class="h-10 w-full" />
    </div>

    <ul
      v-else-if="tasks && tasks.length > 0"
      class="flex flex-col divide-y rounded-lg border bg-card"
    >
      <TaskItem v-for="task in tasks" :key="task.id" :task="task">
        <template #actions>
          <TaskProjectPicker
            @select="(project) => moveToProject(task.id, project)"
          />
        </template>
      </TaskItem>
    </ul>

    <AppLoadError
      v-else-if="error"
      title="Não foi possível carregar a Inbox."
      description="Suas tarefas continuam salvas."
      @retry="refresh()"
    />

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
