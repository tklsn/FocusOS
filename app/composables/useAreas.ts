export const pendingAreaDeletes = new Set<string>();

export function useAreas() {
  return useFetch("/api/areas", {
    key: "areas",
    transform: (areas) =>
      areas.filter((area) => !pendingAreaDeletes.has(area.id)),
  });
}
