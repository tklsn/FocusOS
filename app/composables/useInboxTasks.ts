export function useInboxTasks() {
  return useFetch("/api/tasks", {
    query: { status: "inbox" },
    key: "inbox-tasks",
  });
}
