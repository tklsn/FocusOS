<script lang="ts" setup>
import { Trash2 } from "@lucide/vue";
import { toast } from "vue-sonner";

const props = defineProps<{ project: { id: string; name: string } }>();

defineEmits<{
  (e: "delete"): void;
}>();

const name = ref(props.project.name);

async function saveName() {
  const value = name.value.trim();
  if (!value || value === props.project.name) {
    name.value = props.project.name;
    return;
  }

  try {
    await $fetch(`/api/projects/${props.project.id}`, {
      method: "PATCH",
      body: { name: value },
    });
    refreshNuxtData("projects");
  } catch {
    name.value = props.project.name;
    toast.error("Não foi possível salvar. Tente novamente.");
  }
}

function blur(e: KeyboardEvent) {
  (e.target as HTMLElement).blur();
}

function cancelName(e: KeyboardEvent) {
  name.value = props.project.name;
  blur(e);
}
</script>

<template>
  <li
    :id="`project-${project.id}`"
    class="flex scroll-mt-4 items-center gap-2 px-2 py-2"
  >
    <Input
      v-model="name"
      aria-label="Nome do projeto"
      class="border-transparent bg-transparent shadow-none hover:border-input dark:bg-transparent"
      @blur="saveName"
      @keydown.enter="blur"
      @keydown.esc="cancelName"
    />
    <Button
      variant="ghost"
      size="icon-sm"
      class="text-muted-foreground"
      @click="$emit('delete')"
    >
      <Trash2 />
      <span class="sr-only">Excluir</span>
    </Button>
  </li>
</template>
