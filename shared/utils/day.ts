export function startOfLocalDay(date: Date): Date {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
}

// Hoje inclui o que ficou de dias anteriores (rollover): só o futuro fica de fora.
export function isTodayOrBefore(date: Date, today: Date = new Date()): boolean {
  return startOfLocalDay(date).getTime() <= startOfLocalDay(today).getTime();
}
