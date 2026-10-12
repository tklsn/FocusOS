import { toast } from "vue-sonner";

// Toda escrita em tarefa feita pela interface passa por este arquivo: ele chama
// a API, avisa quando falha e recarrega as listas. As páginas só leem.

type TaskChanges = {
  title?: string;
  notes?: string;
  implementation_intention?: string;
  project_id?: string;
  done?: boolean;
  is_next_action?: boolean;
  today?: boolean;
};

// Tarefas excluídas na UI aguardando o fim do prazo de "Desfazer": ficam fora das
// listas e do contador mesmo que um refresh aconteça nesse intervalo.
export const pendingTaskDeletes = new Set<string>();

// ponytail: recarrega todas as buscas montadas (inclui áreas e projetos), para
// ninguém precisar saber qual lista mostra a tarefa. Filtrar por chave se pesar.
export function refreshTasks() {
  return refreshNuxtData();
}

// Devolve false quando não salvou, para quem chamou desfazer o que mostrou.
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

// Some da tela na hora; a exclusão só vai ao servidor quando o "Desfazer" expira.
export function deleteTask(id: string) {
  pendingTaskDeletes.add(id);
  refreshTasks();

  toastUndo(
    "Tarefa excluída",
    () => $fetch(`/api/tasks/${id}`, { method: "DELETE" }),
    () => {
      pendingTaskDeletes.delete(id);
      refreshTasks();
    },
  );
}
