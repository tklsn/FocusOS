<script lang="ts" setup>
import { Inbox } from "@lucide/vue";

const { data: tasks, status, error, refresh } = useInboxTasks();
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
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-baseline justify-between gap-4 px-4 py-3"
      >
        <span class="text-sm">{{ task.title }}</span>
        <span class="shrink-0 text-xs text-muted-foreground">
          {{ formatCreatedAt(task.created_at) }}
        </span>
      </li>
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
