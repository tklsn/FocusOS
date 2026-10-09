import { toast } from "vue-sonner";

export async function setTaskDone(
  id: string,
  done: boolean,
  refresh: () => void,
) {
  try {
    await $fetch(`/api/tasks/${id}`, { method: "PATCH", body: { done } });
    if (done) {
      toast("Tarefa concluída", {
        action: {
          label: "Desfazer",
          onClick: () => setTaskDone(id, false, refresh),
        },
      });
    }
  } catch {
    toast.error("Não foi possível salvar. Tente novamente.");
  }
  refresh();
}
