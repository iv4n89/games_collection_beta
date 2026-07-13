export function escapeSearchTerm(term: string): string {
  return term.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
