import { toast } from "vue-sonner";

export async function setTaskToday(
  id: string,
  today: boolean,
  refresh: () => void,
) {
  try {
    await $fetch(`/api/tasks/${id}`, { method: "PATCH", body: { today } });
    if (today) {
      toast("Tarefa adicionada para hoje", {
        action: {
          label: "Desfazer",
          onClick: () => setTaskToday(id, false, refresh),
        },
      });
    }
  } catch {
    toast.error("Não foi possível salvar. Tente novamente.");
  }
  refresh();
  refreshNuxtData("today-tasks");
}
