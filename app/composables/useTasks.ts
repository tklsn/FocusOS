// As quatro listas de tarefas da interface. Escrita fica em utils/taskActions.

export function useInboxTasks() {
  return useFetch("/api/tasks", {
    query: { status: "inbox" },
    key: "inbox-tasks",
    transform: hidePendingDeletes,
  });
}

export function useProjectTasks(projectId: string) {
  return useFetch("/api/tasks", {
    query: { project_id: projectId },
    key: `project-tasks-${projectId}`,
    transform: hidePendingDeletes,
  });
}

export function useTodayTasks() {
  return useFetch("/api/tasks/today", {
    key: "today-tasks",
    transform: hidePendingDeletes,
  });
}

export function useNextActions() {
  return useFetch("/api/tasks/next-actions", {
    key: "next-actions",
    transform: hidePendingDeletes,
  });
}
