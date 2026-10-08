// Tarefas excluídas na UI aguardando o fim do prazo de "Desfazer": ficam fora das
// listas e do contador mesmo que um refresh aconteça nesse intervalo.
export const pendingTaskDeletes = new Set<string>();

export function useInboxTasks() {
  return useFetch("/api/tasks", {
    query: { status: "inbox" },
    key: "inbox-tasks",
    transform: (tasks) =>
      tasks.filter((task) => !pendingTaskDeletes.has(task.id)),
  });
}
