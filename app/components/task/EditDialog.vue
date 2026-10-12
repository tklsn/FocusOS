<script lang="ts" setup>
// Edição da ação em destaque na Home: título da tarefa e nota "onde eu parei"
// do projeto dela.
const props = defineProps<{
  task: { id: string; title: string };
  project?: { id: string; resume_note: string | null };
}>();

const open = defineModel<boolean>("open", { required: true });

const title = ref("");
const note = ref("");
const saving = ref(false);

watch(open, (isOpen) => {
  if (!isOpen) return;
  title.value = props.task.title;
  note.value = props.project?.resume_note ?? "";
});

async function save() {
  const newTitle = title.value.trim();
  const newNote = note.value.trim();
  if (!newTitle || saving.value) return;

  saving.value = true;
  let saved = true;
  if (newTitle !== props.task.title) {
    saved = await updateTask(props.task.id, { title: newTitle });
  }
  if (saved && props.project && newNote !== (props.project.resume_note ?? "")) {
    saved = await updateProject(props.project.id, { resume_note: newNote });
  }
  saving.value = false;

  if (saved) open.value = false;
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <form class="flex flex-col gap-4" @submit.prevent="save">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <DialogDescription>
            A nota vale para o projeto inteiro e também aparece na página dele.
          </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-2">
          <Label for="edit-title">Tarefa</Label>
          <Input id="edit-title" v-model="title" required />
        </div>
        <div v-if="project" class="flex flex-col gap-2">
          <Label for="edit-note">Onde você parou</Label>
          <Textarea
            id="edit-note"
            v-model="note"
            placeholder="O que você estava fazendo e qual é o próximo passo."
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            Cancelar
          </Button>
          <Button type="submit" :disabled="saving">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
