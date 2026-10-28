import { notFound } from "next/navigation";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
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
  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
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