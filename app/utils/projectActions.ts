import { toast } from "vue-sonner";

type ProjectChanges = {
  name?: string;
  status?: keyof typeof PROJECT_STATUS_LABELS;
  resume_note?: string;
};

// Devolve false quando não salvou, para quem chamou desfazer o que mostrou.
export async function updateProject(id: string, changes: ProjectChanges) {
  try {
    await $fetch(`/api/projects/${id}`, { method: "PATCH", body: changes });
    await refreshNuxtData("projects");
    return true;
  } catch {
    toast.error("Não foi possível salvar. Tente novamente.");
    return false;
  }
}
