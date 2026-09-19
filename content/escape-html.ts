/**
 * Escapes text for interpolation into an HTML text node or a double-quoted
 * attribute value. Shared by the string-assembling page builders.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
