<script lang="ts" setup>
import { ArrowUpIcon } from "@lucide/vue";
import { z } from "zod";
import { toast } from "vue-sonner";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const formSchema = z.object({
  task: z
    .string({
      required_error: "A tarefa não pode estar vazia.",
    })
    .trim()
    .min(1, {
      message: "A tarefa não pode estar vazia.",
    }),
});

const { defineField, resetForm, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const [task, taskAttrs] = defineField("task");

const addTask = handleSubmit(async (values) => {
  await $fetch("/api/tasks", {
    method: "POST",
    body: { title: values.task },
  });
  refreshNuxtData("inbox-tasks");
  toast.success("Tarefa capturada com sucesso!");
  resetForm();
});
</script>
<template>
  <form @submit.prevent="addTask">
    <InputGroup>
      <InputGroupTextarea
        v-model="task"
        v-bind="taskAttrs"
        placeholder="Adicione uma tarefa rapidamente..."
      />
      <InputGroupAddon align="block-end">
        <FieldError v-if="errors.task" :errors="[errors.task]" />
        <InputGroupButton
          :disabled="!!errors.task"
          variant="default"
          class="rounded-full ml-auto"
          size="icon-xs"
          @click="addTask"
        >
          <ArrowUpIcon class="size-4" />
          <span class="sr-only">Criar</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
