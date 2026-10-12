export const useTodayTasks = () => {
  return useFetch("/api/tasks/today", { key: "today-tasks" });
};
