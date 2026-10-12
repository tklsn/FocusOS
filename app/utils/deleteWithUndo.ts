import { toast } from "vue-sonner";

// Itens excluídos na UI aguardando o fim do prazo de "Desfazer": ficam fora das
// listas e dos contadores mesmo que um refresh aconteça nesse intervalo. Os ids
// são ULIDs, únicos entre tarefas, projetos e áreas, então um conjunto só basta.
const pendingDeletes = new Set<string>();

// Para o `transform` das buscas: esconde o que está com exclusão pendente.
export function hidePendingDeletes<T extends { id: string }>(items: T[]) {
  return items.filter((item) => !pendingDeletes.has(item.id));
}

// O item some da tela na hora; o DELETE em `url` só vai ao servidor quando o
// aviso com "Desfazer" fecha. Se o DELETE falhar, o item volta.
export function deleteWithUndo(id: string, url: string, message: string) {
  pendingDeletes.add(id);
  refreshNuxtData();

  let settled = false;
  const settle = async (undo: boolean) => {
    if (settled) return;
    settled = true;
    try {
      if (!undo) await $fetch(url, { method: "DELETE" });
    } catch {
      toast.error("Não foi possível excluir. O item foi restaurado.");
    }
    pendingDeletes.delete(id);
    refreshNuxtData();
  };

  toast(message, {
    duration: 5000,
    action: { label: "Desfazer", onClick: () => settle(true) },
    onAutoClose: () => settle(false),
    onDismiss: () => settle(false),
  });
}
