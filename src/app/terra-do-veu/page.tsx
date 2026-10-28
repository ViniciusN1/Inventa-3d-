import Link from "next/link";
export const dynamic = "force-dynamic";

export default function TerraDoVeuPage() {
  return (
    <main className="min-h-screen bg-[#080B2A] text-white p-6">
      <section className="max-w-6xl mx-auto py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/feed" className="text-[#F3B4A8] font-black">
            ← Voltar para comunidade
          </Link>

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://www.instagram.com/inventta.3dd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F3B4A8] font-bold"
            >
              📸 Instagram
            </a>

            <Link href="/feed" className="text-white hover:text-[#F3B4A8] font-bold">
              💬 Comunidade
            </Link>

            <Link href="/" className="text-white hover:text-[#F3B4A8] font-bold">
              🛒 Loja
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2.5rem] p-8">
          <p className="text-[#F3B4A8] font-black uppercase tracking-widest text-sm">
            RPG Inventta 3D
          </p>

          <h1 className="text-5xl md:text-6xl font-black text-[#DCCBFF] mt-3">
            Terra do Véu
          </h1>

          <p className="text-zinc-300 mt-4 max-w-3xl text-lg">
            Um mundo de fantasia com peças 3D, torres, biomas, criaturas,
            missões e mapas colecionáveis para jogar em mesa.
          </p>

          <div className="mt-8 bg-gradient-to-r from-[#B69AF8]/20 to-[#F3B4A8]/20 border border-[#B69AF8]/20 rounded-[2rem] p-6">
            <h2 className="text-3xl font-black text-[#DCCBFF]">
              Torre Abelha Rainha
            </h2>

            <p className="mt-3 text-zinc-300 max-w-3xl">
              Uma torre viva criada por uma colmeia ancestral. Pode ser usada
              como cenário, objetivo de missão, base inimiga ou torre defensiva.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/inventta.3dd"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-7 py-4 rounded-2xl font-black hover:scale-105 transition"
              >
                ✨ Acompanhar a saga
              </a>

              <Link
                href="/feed/create"
                className="bg-white/5 border border-[#B69AF8]/20 text-[#DCCBFF] px-7 py-4 rounded-2xl font-black hover:bg-white/10 transition"
              >
                💬 Postar ideia
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            <Card
              icon="🏰"
              title="Torres"
              text="Estruturas especiais para defesa, missões e evolução."
            />

            <Card
              icon="🧙"
              title="Personagens"
              text="Heróis, criaturas e aliados para impressão 3D."
            />

            <Card
              icon="🗺️"
              title="Mapas"
              text="Bases, terrenos, aldeias e biomas para montar o tabuleiro."
            />
          </div>

          <div className="mt-10 bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-8">
            <h2 className="text-3xl font-black text-[#DCCBFF]">
              A História do Véu
            </h2>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              Após a Grande Ruptura, fragmentos de magia espalharam-se pelo
              mundo. Torres ancestrais surgiram nos biomas, protegidas por
              criaturas, povos esquecidos e forças corrompidas. Cada peça
              impressa representa uma parte viva desse universo.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-[#F3B4A8] font-black uppercase tracking-widest text-sm">
              Regiões
            </p>

            <h2 className="text-4xl font-black text-[#DCCBFF] mt-2">
              Biomas da Terra do Véu
            </h2>

            <div className="grid md:grid-cols-5 gap-4 mt-6">
              <MiniCard icon="🌳" title="Floresta Esmeralda" />
              <MiniCard icon="🐝" title="Colmeias Reais" />
              <MiniCard icon="🔥" title="Terras Cinzentas" />
              <MiniCard icon="🏔️" title="Montanhas do Véu" />
              <MiniCard icon="🌊" title="Lago dos Ecos" />
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[#F3B4A8] font-black uppercase tracking-widest text-sm">
              Coleção inicial
            </p>

            <h2 className="text-4xl font-black text-[#DCCBFF] mt-2">
              Próximas miniaturas
            </h2>

            <div className="grid md:grid-cols-3 gap-5 mt-6">
              <Card icon="🐝" title="Abelha Rainha" text="Chefe da colmeia ancestral." />
              <Card icon="🛡️" title="Guardião da Colmeia" text="Defensor da torre viva." />
              <Card icon="🌳" title="Druida do Véu" text="Aliado dos biomas antigos." />
              <Card icon="🐺" title="Lobo Sombrio" text="Criatura corrompida das ruínas." />
              <Card icon="🧙" title="Mago das Ruínas" text="Manipulador dos fragmentos mágicos." />
              <Card icon="🗿" title="Totem Antigo" text="Peça de cenário e objetivo de missão." />
            </div>
          </div>

          <div className="mt-10 bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] rounded-[2rem] p-8 text-[#080B2A]">
            <h2 className="text-3xl font-black">
              Quer participar da criação?
            </h2>

            <p className="mt-3 font-bold max-w-2xl">
              Poste ideias na comunidade, vote em criaturas, sugira biomas e
              acompanhe os bastidores no Instagram oficial.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/feed"
                className="bg-[#080B2A] text-white px-7 py-4 rounded-2xl font-black"
              >
                Entrar na comunidade
              </Link>

              <a
                href="https://www.instagram.com/inventta.3dd"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#080B2A] px-7 py-4 rounded-2xl font-black"
              >
                Ver Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-6 hover:border-[#F3B4A8]/50 transition">
      <p className="text-4xl">{icon}</p>

      <h2 className="text-2xl font-black text-[#DCCBFF] mt-4">
        {title}
      </h2>

      <p className="text-zinc-400 mt-2">{text}</p>
    </div>
  );
}

function MiniCard({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="bg-[#080B2A] border border-[#B69AF8]/20 rounded-2xl p-5">
      <p className="text-3xl">{icon}</p>

      <p className="text-sm font-black text-[#DCCBFF] mt-3">
        {title}
      </p>
    </div>
  );
}