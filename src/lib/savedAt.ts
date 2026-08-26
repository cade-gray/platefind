/** Human-readable "when did we last get the plate list" label. */
export function savedAtLabel(savedAt: number | null): string {
  if (!savedAt) return "not yet saved";
  const when = new Date(savedAt);
  const sameDay = new Date().toDateString() === when.toDateString();
  const time = when.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return sameDay ? `today at ${time}` : when.toLocaleDateString([], { month: "short", day: "numeric" });
}
