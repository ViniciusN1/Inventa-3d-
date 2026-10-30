/**
 * Gera o slug de uma categoria (ou texto qualquer):
 * remove acentos, deixa em minúsculas e troca espaços por hífen.
 * Ex.: "Decoração" -> "decoracao", "Terra do Véu" -> "terra-do-veu".
 */
export function slugify(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
