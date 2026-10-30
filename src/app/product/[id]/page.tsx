import { toPublicProduct } from "@/lib/public-product";
import { notFound } from "next/navigation";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cache } from "react";
import type { Metadata } from "next";
import { SITE_NAME, SITE_LOGO, absoluteUrl } from "@/lib/site";

import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";

const getProduct = cache(async function getProduct(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) return null;

    return toPublicProduct(JSON.parse(JSON.stringify(product)));
  } catch {
    return null;
  }
});

function productDescription(product: { name: string; description?: string }) {
  const text = String(product.description || "").replace(/\s+/g, " ").trim();
  if (text) return text.length > 160 ? `${text.slice(0, 157)}...` : text;
  return `${product.name} feito em impressão 3D personalizada pela Inventta 3D. Envio para todo o Brasil.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produto não encontrado", robots: { index: false } };
  }

  const description = productDescription(product);
  const image = product.image || product.images?.[0] || SITE_LOGO;
  const url = `/product/${id}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: SITE_NAME,
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const productImages: string[] = (
    product.images?.length ? product.images : [product.image]
  )
    .filter(Boolean)
    .map((img: string) => absoluteUrl(img));

  const inStock =
    product.stock === undefined ||
    product.stock === null ||
    Number(product.stock) > 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: productImages,
    description: productDescription(product),
    ...(product.category ? { category: product.category } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${id}`),
      priceCurrency: "BRL",
      price: Number(product.price || 0).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <ProductGallery
              images={
                product.images?.length
                  ? product.images
                  : [product.image]
              }
            />
          </div>

          <div>
            <p className="text-[#F3B4A8] font-bold">
              {product.category}
            </p>

            <h1 className="text-5xl font-black mt-3">
              {product.name}
            </h1>

            <p className="text-3xl font-black mt-6 text-[#DCCBFF]">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <p className="mt-6 text-zinc-300">
              {product.description}
            </p>
            
            {product.videoUrl && (
                <div className="mt-8">
                  <video
                    controls
                    className="rounded-3xl w-full"
                    src={product.videoUrl}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-8">

  {product.material && (
    <div className="bg-white/5 p-4 rounded-xl">
      <p className="text-zinc-400">
        Material
      </p>

      <p className="font-bold">
        {product.material}
      </p>
    </div>
  )}

  {product.color && (
    <div className="bg-white/5 p-4 rounded-xl">
      <p className="text-zinc-400">
        Cor
      </p>

      <p className="font-bold">
        {product.color}
      </p>
    </div>
  )}

  {product.weight && (
    <div className="bg-white/5 p-4 rounded-xl">
      <p className="text-zinc-400">
        Peso
      </p>

      <p className="font-bold">
        {product.weight}
      </p>
    </div>
  )}

  {product.dimensions && (
    <div className="bg-white/5 p-4 rounded-xl">
      <p className="text-zinc-400">
        Dimensões
      </p>

      <p className="font-bold">
        {product.dimensions}
      </p>
    </div>
  )}

</div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}