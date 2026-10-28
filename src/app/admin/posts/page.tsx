export const dynamic = "force-dynamic";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import AdminSidebar from "@/components/AdminSidebar";

async function getPosts() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const posts = await db
    .collection("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-8 pt-24">
      <AdminSidebar />

      <div className="mb-10">
        <p className="text-pink-400 font-bold uppercase tracking-widest text-sm">
          Comunidade
        </p>

        <h1 className="text-5xl font-black mt-3">
          Controle de Posts
        </h1>

        <p className="text-zinc-400 mt-2">
          Monitore fotos, curtidas e publicações dos usuários.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400">Posts</p>
          <h2 className="text-4xl font-black mt-2">{posts.length}</h2>
        </div>

        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400">Curtidas totais</p>
          <h2 className="text-4xl font-black mt-2 text-pink-400">
            {posts.reduce((acc: number, post: any) => acc + Number(post.likes || 0), 0)}
          </h2>
        </div>

        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400">Mais curtido</p>
          <h2 className="text-4xl font-black mt-2 text-purple-400">
            {Math.max(0, ...posts.map((post: any) => Number(post.likes || 0)))}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <div
            key={post._id}
            className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden"
          >
            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-square object-cover bg-black"
            />

            <div className="p-6">
              <p className="font-black text-white">
                {post.userName || "Usuário"}
              </p>

              <p className="text-zinc-400 text-sm mt-1">
                {new Date(post.createdAt).toLocaleDateString("pt-BR")}
              </p>

              <p className="text-zinc-300 mt-4">
                {post.caption || "Sem legenda"}
              </p>

              <div className="flex items-center justify-between mt-5">
                <span className="text-pink-400 font-black">
                  ❤️ {post.likes || 0}
                </span>

                <form action={`/api/admin/posts/${post._id}/delete`} method="POST">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
                    Apagar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}