import { toast } from "vue-sonner";

// Toda escrita em tarefa feita pela interface passa por este arquivo: ele chama
// a API, avisa quando falha e recarrega as listas. As páginas só leem.
// As funções devolvem false quando não gravaram, para quem chamou desfazer o
// que tinha mostrado.

type TaskChanges = {
  title?: string;
  notes?: string;
  implementation_intention?: string;
  project_id?: string;
  done?: boolean;
  is_next_action?: boolean;
  today?: boolean;
};

// ponytail: recarrega todas as buscas montadas (inclui áreas e projetos), para
// ninguém precisar saber qual lista mostra a tarefa. Filtrar por chave se pesar.
export function refreshTasks() {
  return refreshNuxtData();
}

// Sem projeto a tarefa vai para a Inbox.
export async function createTask(title: string, projectId?: string) {
  try {
    await $fetch("/api/tasks", {
      method: "POST",
      body: { title, project_id: projectId },
    });
  } catch {
    toast.error("Não foi possível criar a tarefa. Tente novamente.");
    return false;
  }
  toast.success("Tarefa capturada com sucesso!");
  refreshTasks();
  return true;
}

export async function updateTask(id: string, changes: TaskChanges) {
  let saved = true;
  try {
    await $fetch(`/api/tasks/${id}`, { method: "PATCH", body: changes });
  } catch {
    saved = false;
    toast.error("Não foi possível salvar. Tente novamente.");
  }
  refreshTasks();
  return saved;
}

export async function setTaskDone(id: string, done: boolean) {
  const saved = await updateTask(id, { done });
  if (saved && done) {
    toast("Tarefa concluída", {
      action: { label: "Desfazer", onClick: () => setTaskDone(id, false) },
    });
  }
}

export async function setTaskToday(id: string, today: boolean) {
  const saved = await updateTask(id, { today });
  if (saved && today) {
    toast("Tarefa adicionada para hoje", {
      action: { label: "Desfazer", onClick: () => setTaskToday(id, false) },
    });
  }
}

export function deleteTask(id: string) {
  deleteWithUndo(id, `/api/tasks/${id}`, "Tarefa excluída");
}

// `ids` é a lista de tarefas abertas do projeto, já na ordem nova. Quem chama
// mostra a ordem nova antes; se a gravação falhar, a recarga devolve a antiga.
export async function reorderProjectTasks(projectId: string, ids: string[]) {
  try {
    await $fetch(`/api/projects/${projectId}/tasks/order`, {
      method: "PUT",
      body: { ids },
    });
    return true;
  } catch {
    toast.error("Não foi possível reordenar. Tente novamente.");
    refreshTasks();
    return false;
  }
}
