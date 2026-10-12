<script lang="ts" setup>
// Campo de texto que edita no lugar: salva ao sair ou com Enter; Esc desfaz.
// Se `save` devolver false, o campo volta ao valor salvo.
const props = defineProps<{
  // valor salvo; o que está sendo digitado fica só aqui dentro
  value: string;
  save: (value: string) => Promise<boolean>;
  // vazio não é aceito: volta ao valor salvo sem chamar `save`
  required?: boolean;
  // sem borda nem fundo até passar o mouse, para caber em linhas de lista
  ghost?: boolean;
}>();

const draft = ref(props.value);
watch(
  () => props.value,
  (value) => (draft.value = value),
);

async function commit() {
  const value = draft.value.trim();
  if (value === props.value || (!value && props.required)) {
    draft.value = props.value;
    return;
  }
  if (!(await props.save(value))) draft.value = props.value;
}

function blur(e: KeyboardEvent) {
  (e.target as HTMLElement).blur();
}

function cancel(e: KeyboardEvent) {
  draft.value = props.value;
  blur(e);
}
</script>

<template>
  <Input
    v-model="draft"
    :class="
      ghost &&
      'border-transparent bg-transparent shadow-none hover:border-input dark:bg-transparent'
    "
    @blur="commit"
    @keydown.enter="blur"
    @keydown.esc="cancel"
  />
</template>
