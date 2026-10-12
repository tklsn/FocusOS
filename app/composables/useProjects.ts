export function useProjects() {
  return useFetch("/api/projects", {
    key: "projects",
    transform: hidePendingDeletes,
  });
}
