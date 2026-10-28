import Link from "next/link";
import FollowButton from "@/components/FollowButton";

async function getProfile(username: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/profile/${username}`,
      {
        cache: "no-store",
      }
    );

    return await res.json();
  } catch {
    return {
      success: false,
    };
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const data = await getProfile(username);

  if (!data.success) {
    return (
      <main className="min-h-screen bg-[#080B2A] text-white flex items-center justify-center p-6">
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center max-w-lg">
          <h1 className="text-4xl font-black text-[#DCCBFF]">
            Perfil não encontrado
          </h1>

          <Link
            href="/feed"
            className="inline-block mt-8 bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-8 py-4 rounded-2xl font-black"
          >
            Voltar para comunidade
          </Link>
        </div>
      </main>
    );
  }

  const user = data.user;
  const posts = data.posts || [];
  const stats = data.stats || {};

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Link
          href="/feed"
          className="text-[#F3B4A8] font-bold"
        >
          ← Voltar para comunidade
        </Link>

        <div className="mt-8 bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2.5rem] p-8">
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] flex items-center justify-center text-5xl font-black">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              ) : (
                String(user.name || "U")
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <p className="text-[#F3B4A8] font-bold">
                @{user.username || username}
              </p>

              <h1 className="text-5xl font-black text-[#DCCBFF] mt-2">
                {user.name || "Usuário"}
              </h1>

              <p className="text-zinc-400 mt-3 max-w-2xl">
                {user.bio ||
                  "Membro da comunidade Inventta 3D."}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Stat label="Posts" value={stats.posts || 0} />
                <Stat label="Curtidas" value={stats.likes || 0} />
                <Stat label="Pontos" value={stats.points || 0} />
                <Stat label="Seguidores" value={stats.followers || 0} />
                <Stat label="Seguindo" value={stats.following || 0} />
              </div>
            </div>

            <FollowButton followingId={user._id} />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-black text-[#DCCBFF]">
            Projetos publicados
          </h2>

          {posts.length === 0 ? (
            <div className="mt-6 bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center">
              <p className="text-zinc-400 font-bold">
                Este usuário ainda não publicou projetos.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {posts.map((post: any) => (
                <div
                  key={post._id}
                  className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full aspect-square object-cover"
                  />

                  <div className="p-5">
                    <p className="text-zinc-300">
                      {post.caption || "Projeto Inventta 3D"}
                    </p>

                    <p className="text-[#F3B4A8] font-black mt-3">
                      ❤️ {post.likes || 0} curtidas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
      <p className="text-2xl font-black text-white">
        {value}
      </p>

      <p className="text-xs text-zinc-400 font-bold">
        {label}
      </p>
    </div>
  );
}