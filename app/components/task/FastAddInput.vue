<script lang="ts" setup>
import { ArrowUpIcon, Loader2Icon } from "@lucide/vue";
import { z } from "zod";
import { toast } from "vue-sonner";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const formSchema = z.object({
  task: z
    .string({ required_error: "A tarefa não pode estar vazia." })
    .trim()
    .min(1, { message: "A tarefa não pode estar vazia." }),
});

const { defineField, resetForm, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const [task, taskAttrs] = defineField("task");

const textarea = useTemplateRef("textarea");
onMounted(() => textarea.value?.$el.focus());

// Com projectId a tarefa nasce no projeto; sem, vai para a Inbox.
const props = defineProps<{ projectId?: string }>();

const emit = defineEmits<{
  (e: "created"): void;
}>();

const addTask = handleSubmit(async (values) => {
  try {
    await $fetch("/api/tasks", {
      method: "POST",
      body: { title: values.task, project_id: props.projectId },
    });
    refreshNuxtData("inbox-tasks");
    toast.success("Tarefa capturada com sucesso!");
    resetForm();
    emit("created");
  } catch {
    toast.error("Não foi possível criar a tarefa. Tente novamente.");
  }
});

function onEnter(e: KeyboardEvent) {
  if (e.shiftKey || e.isComposing || isSubmitting.value) return;
  e.preventDefault();
  addTask();
}
</script>

<template>
  <form @submit.prevent="addTask">
    <InputGroup>
      <InputGroupTextarea
        v-model="task"
        v-bind="taskAttrs"
        ref="textarea"
        placeholder="Adicione uma tarefa rapidamente..."
        @keydown.enter="onEnter"
      />
      <InputGroupAddon align="block-end">
        <slot name="message" />
        <FieldError v-if="errors.task" :errors="[errors.task]" />
        <InputGroupButton
          type="submit"
          :disabled="isSubmitting"
          variant="default"
          class="rounded-full ml-auto"
          size="icon-xs"
        >
          <Loader2Icon v-if="isSubmitting" class="size-4 animate-spin" />
          <ArrowUpIcon v-else class="size-4" />
          <span class="sr-only">Criar</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
