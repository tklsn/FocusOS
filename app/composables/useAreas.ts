export function useAreas() {
  return useFetch("/api/areas", {
    key: "areas",
    transform: hidePendingDeletes,
  });
}
