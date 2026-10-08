export const pendingInboxDeletes = new Set<string>();

export function useInboxTasks() {
  return useFetch("/api/tasks", {
    query: { status: "inbox" },
    key: "inbox-tasks",
    transform: (tasks) =>
      tasks.filter((task) => !pendingInboxDeletes.has(task.id)),
  });
}
