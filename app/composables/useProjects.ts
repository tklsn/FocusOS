// Projetos excluídos na UI aguardando o fim do prazo de "Desfazer" (ver useInboxTasks).
export const pendingProjectDeletes = new Set<string>();

export function useProjects() {
  return useFetch("/api/projects", {
    key: "projects",
    transform: (projects) =>
      projects.filter((project) => !pendingProjectDeletes.has(project.id)),
  });
}
