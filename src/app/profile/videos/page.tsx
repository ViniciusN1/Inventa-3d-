"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfileVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch("/api/user/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setVideos(data.videos || []);
      setLoading(false);
    }

    loadVideos();
  }, []);

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6">
      <section className="max-w-6xl mx-auto">
        <Link
          href="/profile"
          className="text-pink-400 font-bold"
        >
          ← Voltar ao perfil
        </Link>

        <h1 className="text-5xl font-black mt-8">
          Meus vídeos
        </h1>

        <p className="text-zinc-400 mt-3">
          Conteúdos liberados após a compra.
        </p>

        {loading ? (
          <p className="mt-10 text-zinc-400">
            Carregando vídeos...
          </p>
        ) : videos.length === 0 ? (
          <div className="mt-10 bg-[#101014] border border-white/10 rounded-[2rem] p-10 text-center">
            <h2 className="text-3xl font-black">
              Nenhum vídeo liberado
            </h2>

            <p className="text-zinc-400 mt-3">
              Após comprar um produto com tutorial, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {videos.map((product) => (
              <div
                key={product._id}
                className="bg-[#101014] border border-white/10 rounded-[2rem] overflow-hidden"
              >
                <div className="bg-black/30 p-5">
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full rounded-2xl max-h-[420px]"
                  />
                </div>

                <div className="p-6">
                  <p className="text-pink-400 font-bold text-sm uppercase tracking-widest">
                    Tutorial liberado
                  </p>

                  <h2 className="text-2xl font-black mt-2">
                    {product.name}
                  </h2>

                  <p className="text-zinc-400 mt-3">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}