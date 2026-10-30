"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function extractHashtags(text: string) {
  return (
    text
      .match(/#[\wÀ-ÿ_]+/g)
      ?.map((tag) =>
        tag.replace("#", "").toLowerCase()
      ) || []
  );
}

function extractMentions(text: string) {
  return (
    text
      .match(/@[\wÀ-ÿ_]+/g)
      ?.map((tag) =>
        tag.replace("@", "").toLowerCase()
      ) || []
  );
}

export default function CreatePostPage() {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. Use uma imagem com até 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setImage(base64);
      setPreview(base64);
    };

    reader.readAsDataURL(file);
  }

  async function createPost() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!image) {
      alert("Adicione uma imagem.");
      return;
    }

    const hashtags = extractHashtags(caption);
    const mentions = extractMentions(caption);

    const category =
      hashtags.length > 0 ? hashtags[0] : "geral";

    setLoading(true);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          file: image,
          type: "image",
        }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert(uploadData.error || "Erro no upload");
        return;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: uploadData.url,
          caption,
          hashtags,
          mentions,
          category,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao publicar");
        return;
      }

      router.push("/feed");
    } catch (error) {
      console.log(error);
      alert("Erro ao publicar");
    } finally {
      setLoading(false);
    }
  }

  const hashtags = extractHashtags(caption);
  const mentions = extractMentions(caption);

  return (
    <main className="min-h-screen bg-[#080B2A] text-white p-6">
      <div className="max-w-xl mx-auto bg-[#0B0E33] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.35)] border border-[#B69AF8]/20 p-8">
        <Link
          href="/feed"
          className="text-[#F3B4A8] font-bold hover:text-[#DCCBFF]"
        >
          ← Voltar à comunidade
        </Link>

        <h1 className="text-4xl font-black text-[#DCCBFF] mt-6">
          Novo post
        </h1>

        <p className="text-zinc-400 mt-2 mb-8">
          Use <strong>#categoria</strong> para classificar e{" "}
          <strong>@usuario</strong> para marcar alguém.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="block mb-2 font-bold text-[#F3B4A8]">
              Foto do projeto
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-zinc-300"
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full aspect-square object-cover rounded-3xl border border-[#B69AF8]/20"
            />
          )}

          <textarea
            placeholder="Ex: Minha miniatura ficou pronta! #rpg #miniaturas @felipe"
            value={caption}
            onChange={(e) =>
              setCaption(e.target.value)
            }
            className="w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 min-h-32 outline-none focus:border-[#F3B4A8]"
          />

          {(hashtags.length > 0 || mentions.length > 0) && (
            <div className="bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-4 space-y-3">
              {hashtags.length > 0 && (
                <div>
                  <p className="text-sm text-[#F3B4A8] font-black mb-2">
                    Categorias / tags
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#B69AF8]/15 border border-[#B69AF8]/30 text-[#DCCBFF] px-3 py-2 rounded-full text-sm font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {mentions.length > 0 && (
                <div>
                  <p className="text-sm text-[#F3B4A8] font-black mb-2">
                    Marcações
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {mentions.map((mention) => (
                      <span
                        key={mention}
                        className="bg-[#F3B4A8]/15 border border-[#F3B4A8]/30 text-[#F3B4A8] px-3 py-2 rounded-full text-sm font-bold"
                      >
                        @{mention}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={createPost}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-4 rounded-2xl font-black disabled:opacity-50"
          >
            {loading
              ? "Publicando..."
              : "Publicar na comunidade"}
          </button>
        </div>
      </div>
    </main>
  );
}