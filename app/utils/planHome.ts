// Regra da Home. O destaque é a tarefa escolhida com "Focar", senão a primeira
// de hoje, senão a primeira sugestão. Sugestões são as próximas ações dos
// projetos que ainda não estão em hoje.
export function planHome<T extends { id: string }>(
  todayTasks: T[],
  nextActions: T[],
  focusedId: string | null,
) {
  const suggestions = nextActions.filter(
    (task) => !todayTasks.some((todayTask) => todayTask.id === task.id),
  );
  const highlight =
    todayTasks.find((task) => task.id === focusedId) ??
    todayTasks[0] ??
    suggestions[0];

  return {
    highlight,
    // sem nada em hoje, o destaque é só uma sugestão
    isSuggestion: todayTasks.length === 0,
    laterToday: todayTasks.filter((task) => task !== highlight),
    moreSuggestions: suggestions.filter((task) => task !== highlight),
  };
}
