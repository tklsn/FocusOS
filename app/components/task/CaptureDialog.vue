<script setup lang="ts">
import { useEventListener } from "@vueuse/core";

const open = ref(false);

function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable
  );
}

useEventListener(window, "keydown", (e: KeyboardEvent) => {
  if (e.repeat || isEditableTarget(e.target)) return;

  const mod = isMac ? e.metaKey : e.ctrlKey;
  const otherMod = isMac ? e.ctrlKey : e.metaKey;

  if (
    mod &&
    !otherMod &&
    !e.altKey &&
    !e.shiftKey &&
    e.key.toLowerCase() === "i"
  ) {
    e.preventDefault();
    open.value = true;
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :show-close-button="false" class="w-full max-w-md gap-0 p-0">
      <DialogTitle class="sr-only">Capturar tarefa</DialogTitle>
      <DialogDescription class="sr-only">
        Digite a tarefa e pressione Enter para salvar.
      </DialogDescription>
      <TaskFastAddInput @created="open = false" />
    </DialogContent>
  </Dialog>
</template>
