export function useProjectTasks(projectId: string) {
  return useFetch("/api/tasks", {
    query: { project_id: projectId },
    key: `project-tasks-${projectId}`,
    transform: (tasks) =>
      tasks.filter((task) => !pendingTaskDeletes.has(task.id)),
  });
}
