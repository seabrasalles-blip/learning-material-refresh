import type { Modo } from "@/data/figuras";

export const demonstrationKey = (modo: Modo) => `mila-example-seen-${modo}`;
export function shouldShowDemonstration(modo: Modo): boolean {
  try { return sessionStorage.getItem(demonstrationKey(modo)) !== "yes"; }
  catch { return true; }
}
export function markDemonstrationSeen(modo: Modo) {
  try { sessionStorage.setItem(demonstrationKey(modo), "yes"); }
  catch { /* Reviewing the example remains available without storage. */ }
}