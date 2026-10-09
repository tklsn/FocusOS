<script lang="ts" setup>
import { Timer } from "@lucide/vue";
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Timer />
      </EmptyMedia>
      <EmptyTitle>O modo Foco ainda não está pronto.</EmptyTitle>
      <EmptyDescription>
        Por enquanto, a tarefa continua esperando você na tela Hoje.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" as-child>
        <NuxtLink to="/">Voltar para Hoje</NuxtLink>
      </Button>
    </EmptyContent>
  </Empty>
</template>
