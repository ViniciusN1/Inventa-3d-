/** Configurações de SEO / URL pública da Inventta 3D. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://inventta-3dd.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Inventta 3D";

export const SITE_DEFAULT_TITLE = "Inventta 3D – Impressão 3D personalizada";

export const SITE_DESCRIPTION =
  "Impressão 3D personalizada em Aquidauana-MS: peças geek, RPG, miniaturas, decoração, chaveiros e presentes únicos. Envio para todo o Brasil.";

export const SITE_LOGO = "/Logo_icon.png";

export const STORE_CATEGORIES = [
  { name: "Geek", slug: "geek" },
  { name: "Infantil", slug: "infantil" },
  { name: "Decoração", slug: "decoracao" },
  { name: "Miniaturas", slug: "miniaturas" },
  { name: "Chaveiros", slug: "chaveiros" },
  { name: "RPG", slug: "rpg" },
  { name: "Personalizados", slug: "personalizados" },
  { name: "Terra do Véu", slug: "terra-do-veu" },
];

/** Filtro de produtos visíveis na loja (ignora os marcados como inativos). */
export const ACTIVE_PRODUCT_FILTER = {
  active: { $ne: false },
  status: { $nin: ["inactive", "inativo", "archived", "draft"] },
};

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
