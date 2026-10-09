export function useNextActions() {
  return useFetch("/api/tasks/next-actions", { key: "next-actions" });
}
