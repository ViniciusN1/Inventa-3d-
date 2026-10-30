import type { MetadataRoute } from "next";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { SITE_URL, STORE_CATEGORIES, ACTIVE_PRODUCT_FILTER } from "@/lib/site";

// Gerado a cada requisição para incluir produtos novos (e não depender do banco no build).
export const dynamic = "force-dynamic";

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

async function getProductEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const products = await db
      .collection("products")
      .find(ACTIVE_PRODUCT_FILTER, { projection: { _id: 1, updatedAt: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return products.map((p) => ({
      url: `${SITE_URL}/product/${p._id.toString()}`,
      lastModified: toIso(p.updatedAt || p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("SITEMAP PRODUCTS ERROR:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...STORE_CATEGORIES.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticEntries, ...(await getProductEntries())];
}
