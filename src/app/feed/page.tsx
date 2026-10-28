"use client";

import PostComments from "@/components/PostComments";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaHeart,
  FaPlus,
  FaRegComment,
  FaTrophy,
  FaFire,
  FaVoteYea,
  FaMedal,
  FaShoppingBag,
} from "react-icons/fa";

const ideas = [
  "Capivara articulada",
  "Chaveiro anime",
  "Suporte de controle",
  "Miniatura RPG",
];

function getProfileHref(post: any) {
  const username = String(post.username || "")
    .replace("@", "")
    .toLowerCase()
    .trim();

  if (!username || username === "usuario") {
    return "/feed";
  }

  return `/profile/${username}`;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIdea, setVotedIdea] = useState("");

  async function loadPosts() {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();

    const savedVote = localStorage.getItem("inventta_vote");
    if (savedVote) setVotedIdea(savedVote);
  }, []);

  async function toggleLike(postId: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro ao curtir");
      return;
    }

    loadPosts();
  }

  function voteIdea(idea: string) {
    setVotedIdea(idea);
    localStorage.setItem("inventta_vote", idea);
    alert(`Voto registrado: ${idea}`);
  }

  const ranking = useMemo(() => {
    const map: Record<string, { name: string; username: string; points: number }> = {};

    posts.forEach((post) => {
      const username = String(post.username || post.userName || "usuario")
        .replace("@", "")
        .toLowerCase()
        .trim();

      const name = post.userName || "Usuário";
      const likes = Number(post.likes || 0);

      if (!map[username]) {
        map[username] = {
          name,
          username,
          points: 0,
        };
      }

      map[username].points += 10 + likes + Number(post.commentsCount || 0) * 2;
    });

    return Object.values(map)
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, [posts]);

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <header className="sticky top-0 z-40 bg-[#080B2A]/90 backdrop-blur-2xl border-b border-[#B69AF8]/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-[#B69AF8]/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              <FaArrowLeft className="text-[#DCCBFF]" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[#DCCBFF] truncate">
                Comunidade Inventta
              </h1>

              <p className="text-xs text-[#F3B4A8] font-bold">
                Projetos, impressões 3D e ideias dos clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
  <Link
    href="/terra-do-veu"
    className="w-14 h-14 rounded-2xl bg-[#0B0E33] border border-[#F3B4A8]/40 flex items-center justify-center hover:scale-105 transition shadow-[0_0_25px_rgba(243,180,168,0.25)]"
    title="Terra do Véu RPG"
  >
    🏰
  </Link>

  <Link
    href="/feed/create"
    className="bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-5 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_0_25px_rgba(182,154,248,0.35)] transition hover:scale-105 shrink-0"
  >
    <FaPlus />
    <span className="hidden sm:inline">Novo post</span>
  </Link>
</div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 bg-gradient-to-r from-[#B69AF8]/20 to-[#F3B4A8]/20 border border-[#B69AF8]/20 rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[#F3B4A8] font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <FaFire />
                Desafio da semana
              </p>

              <h2 className="text-3xl md:text-4xl font-black text-[#DCCBFF] mt-3">
                Mostre sua peça 3D mais criativa
              </h2>

              <p className="text-zinc-300 mt-3 max-w-2xl">
                Poste miniaturas, chaveiros, suportes, decoração, pinturas,
                testes de impressão ou ideias para novos produtos.
              </p>
            </div>

            <Link
              href="/feed/create"
              className="bg-[#F3B4A8] text-[#080B2A] px-7 py-4 rounded-2xl font-black text-center hover:scale-105 transition"
            >
              Participar agora
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="max-w-xl mx-auto w-full">
            {loading ? (
              <div className="bg-[#0B0E33] rounded-[2rem] p-10 text-center border border-[#B69AF8]/20">
                <div className="w-14 h-14 border-4 border-[#B69AF8] border-t-transparent rounded-full animate-spin mx-auto" />

                <p className="text-zinc-400 font-bold mt-5">
                  Carregando comunidade...
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className="space-y-6">
                <div className="bg-[#0B0E33] rounded-[2rem] p-10 text-center border border-[#B69AF8]/20">
                  <div className="text-7xl mb-5">📸</div>

                  <h2 className="text-3xl font-black text-[#DCCBFF]">
                    Nenhum post ainda
                  </h2>

                  <p className="text-zinc-400 mt-3">
                    Seja o primeiro a mostrar uma peça, ideia ou projeto 3D.
                  </p>

                  <Link
                    href="/feed/create"
                    className="inline-flex mt-8 bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-7 py-4 rounded-2xl font-black"
                  >
                    Criar primeiro post
                  </Link>
                </div>

                <VoteBox votedIdea={votedIdea} voteIdea={voteIdea} />
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => {
                  const profileHref = getProfileHref(post);

                  return (
                    <article
                      key={post._id}
                      className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] overflow-hidden hover:border-[#F3B4A8]/50 transition"
                    >
                      <div className="p-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Link
                            href={profileHref}
                            className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] flex items-center justify-center font-black overflow-hidden"
                          >
                            {post.userAvatar ? (
                              <img
                                src={post.userAvatar}
                                alt={post.userName || "Usuário"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              post.userName?.charAt(0)?.toUpperCase() || "U"
                            )}
                          </Link>

                          <div className="min-w-0">
                            <Link
                              href={profileHref}
                              className="font-black text-white leading-none hover:text-[#F3B4A8] transition block truncate"
                            >
                              {post.userName || "Usuário"}
                            </Link>

                            <Link
                              href={profileHref}
                              className="text-xs text-[#F3B4A8] hover:text-[#DCCBFF] transition mt-1 block"
                            >
                              @{post.username || "sem-usuario"}
                            </Link>

                            <p className="text-xs text-zinc-500 mt-1">
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString("pt-BR")
                                : ""}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs bg-white/5 border border-white/10 text-[#DCCBFF] px-3 py-2 rounded-full font-black shrink-0">
                          #{post.category || "projeto3d"}
                        </span>
                      </div>

                      <div className="bg-black">
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full aspect-square object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5 text-2xl">
                            <button
                              onClick={() => toggleLike(post._id)}
                              className="text-[#F3B4A8] hover:scale-110 transition active:scale-90"
                              title="Curtir"
                            >
                              <FaHeart />
                            </button>

                            <button
                              className="text-[#DCCBFF] hover:scale-110 transition active:scale-90"
                              title="Comentários"
                            >
                              <FaRegComment />
                            </button>

                            <button
                              className="text-yellow-300 hover:scale-110 transition active:scale-90"
                              title="Pontos"
                            >
                              <FaTrophy />
                            </button>
                          </div>

                          <span className="text-xs bg-[#B69AF8]/15 text-[#DCCBFF] border border-[#B69AF8]/20 px-3 py-2 rounded-full font-black">
                            + pontos
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm font-black">
                          <p className="text-white">
                            ❤️ {post.likes || 0} curtidas
                          </p>

                          <p className="text-zinc-400">
                            💬 {post.commentsCount || 0} comentários
                          </p>
                        </div>

                        {post.caption && (
                          <p className="mt-3 text-zinc-300 leading-relaxed">
                            <Link
                              href={profileHref}
                              className="text-[#DCCBFF] font-black hover:text-[#F3B4A8]"
                            >
                              @{post.username || post.userName || "usuario"}
                            </Link>{" "}
                            {post.caption}
                          </p>
                        )}

                        {Array.isArray(post.hashtags) && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.hashtags.map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs bg-white/5 border border-white/10 text-[#F3B4A8] px-3 py-2 rounded-full font-black"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {Array.isArray(post.mentions) && post.mentions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.mentions.map((mention: string) => (
                              <Link
                                key={mention}
                                href={`/profile/${mention}`}
                                className="text-xs bg-[#B69AF8]/10 border border-[#B69AF8]/20 text-[#DCCBFF] px-3 py-2 rounded-full font-black hover:text-[#F3B4A8]"
                              >
                                @{mention}
                              </Link>
                            ))}
                          </div>
                        )}

                        {post.productId && (
                          <Link
                            href={`/product/${post.productId}`}
                            className="mt-4 flex items-center gap-3 bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-4 hover:border-[#F3B4A8]/60 transition"
                          >
                            <FaShoppingBag className="text-[#F3B4A8]" />

                            <div>
                              <p className="text-xs text-zinc-400 font-bold">
                                Produto relacionado
                              </p>

                              <p className="font-black text-[#DCCBFF]">
                                {post.productName || "Ver produto"}
                              </p>
                            </div>
                          </Link>
                        )}

                        <PostComments postId={post._id} />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="bg-[#0B0E33] rounded-[2rem] border border-[#B69AF8]/20 p-6">
                <h2 className="text-2xl font-black text-[#DCCBFF] flex items-center gap-2">
                  <FaMedal className="text-[#F3B4A8]" />
                  Ranking da semana
                </h2>

                <div className="mt-5 space-y-3">
                  {ranking.length === 0 ? (
                    <p className="text-sm text-zinc-400">
                      Seja o primeiro membro da comunidade.
                    </p>
                  ) : (
                    ranking.map((item, index) => (
                      <Link
                        key={item.username}
                        href={`/profile/${item.username}`}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 hover:border-[#F3B4A8]/50 transition"
                      >
                        <span className="font-bold text-zinc-300">
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : "⭐"}{" "}
                          {item.name}
                        </span>

                        <strong className="text-[#F3B4A8]">
                          {item.points}
                        </strong>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-[#0B0E33] rounded-[2rem] border border-[#B69AF8]/20 p-6">
                <h2 className="text-2xl font-black text-[#DCCBFF]">
                  Como ganhar pontos
                </h2>

                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  <p>📸 Poste sua peça impressa: +10 pontos</p>
                  <p>❤️ Receba curtidas: +1 ponto</p>
                  <p>💬 Comente ideias: +2 pontos</p>
                  <p>🛒 Compra aprovada: +20 pontos</p>
                  <p>🏆 Top do mês ganha cupom</p>
                </div>
              </div>

              <VoteBox votedIdea={votedIdea} voteIdea={voteIdea} />

              <div className="bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8] rounded-[2rem] p-6 text-[#080B2A] shadow-xl">
                <h2 className="text-2xl font-black">
                  Clube Inventta 3D
                </h2>

                <p className="mt-2 font-medium">
                  Compartilhe seus projetos, ganhe pontos e desbloqueie cupons em breve.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function VoteBox({
  votedIdea,
  voteIdea,
}: {
  votedIdea: string;
  voteIdea: (idea: string) => void;
}) {
  return (
    <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">
      <p className="text-[#F3B4A8] font-black uppercase tracking-widest text-sm flex items-center gap-2">
        <FaVoteYea />
        Vote no próximo produto
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 mt-5">
        {ideas.map((idea) => (
          <button
            key={idea}
            onClick={() => voteIdea(idea)}
            className={`p-4 rounded-2xl border text-left font-bold transition ${
              votedIdea === idea
                ? "bg-[#F3B4A8] text-[#080B2A] border-[#F3B4A8]"
                : "bg-white/5 text-zinc-300 border-white/10 hover:border-[#F3B4A8]/50"
            }`}
          >
            {votedIdea === idea ? "✅ " : "🗳️ "}
            {idea}
          </button>
        ))}
      </div>
    </div>
  );
}