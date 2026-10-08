<script lang="ts" setup>
import { Sun } from "@lucide/vue";

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="font-heading">
      <h1 class="text-4xl font-bold">Hoje</h1>
      <p class="text-xl text-muted-foreground first-letter:uppercase">
        {{ today }}
      </p>
    </header>

    <TaskFastAddInput>
      <template #message>
        <p class="text-muted-foreground text-sm">
          Use
          <Kbd>{{ isMac ? "⌘" : "Ctrl" }}</Kbd>
          <span>+</span>
          <Kbd>I</Kbd>
          para abrir este campo rapidamente de qualquer lugar.
        </p>
      </template>
    </TaskFastAddInput>

    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Sun />
        </EmptyMedia>
        <EmptyTitle>Hoje está livre.</EmptyTitle>
        <EmptyDescription>
          Quando algo surgir, é só capturar, sem precisar organizar agora.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
