import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles } from "@/data/mock";

/* Mozaik tile boyutları — farklı hikayelerin yan yana geldiği his */
const tileShapes = [
  "md:col-span-6 md:row-span-2",   // büyük
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-5 md:row-span-2",   // büyük
  "md:col-span-4",
] as const;

const Collective = () => {
  const list = articles.filter((a) => a.kind === "Kolektif");
  // Demo için yeterli kart üretmek için aynı listeyi tekrar kullanabiliriz
  const tiles = list.length >= 6 ? list : [...list, ...list, ...list].slice(0, 9);

  return (
    <SiteLayout>
      {/* Başlık */}
      <section className="border-b border-hairline">
        <div className="wide-column px-6 pt-20 md:pt-24 pb-14">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="eyebrow text-accent">Bölüm</span>
              <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-tight leading-[1.02]">
                Kolektif
              </h1>
              <p className="mt-5 text-xl text-muted-foreground max-w-xl text-balance">
                Farklı hayatların, farklı seslerin yan yana geldiği bir mozaik —
                kişisel deneyim ve gözlem üzerine yazılar.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right text-xs text-muted-foreground font-mono-jb tracking-wider">
              {tiles.length.toString().padStart(2, "0")} HİKAYE · {list.length} YAZAR
            </div>
          </div>
        </div>
      </section>

      {/* Mozaik */}
      <section className="wide-column px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-12 md:auto-rows-[16rem] gap-5">
          {tiles.map((a, i) => {
            const shape = tileShapes[i % tileShapes.length];
            const isLarge = shape.includes("row-span-2");
            return (
              <Link
                key={`${a.slug}-${i}`}
                to={`/yazi/${a.slug}`}
                className={`group relative overflow-hidden bg-surface-raised border border-hairline hover:border-foreground/30 transition-colors flex flex-col ${shape}`}
              >
                <div
                  className={`overflow-hidden bg-secondary ${
                    isLarge ? "h-1/2" : "h-32"
                  }`}
                >
                  <img
                    src={a.cover}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2 text-[0.65rem] font-mono-jb tracking-wider text-muted-foreground">
                    <span className="text-accent">KOLEKTİF</span>
                    <span>·</span>
                    <span>{a.publishedAt.toUpperCase()}</span>
                  </div>
                  <h3
                    className={`mt-2 font-display leading-snug group-hover:text-accent transition-colors text-balance ${
                      isLarge ? "text-2xl md:text-3xl" : "text-lg"
                    }`}
                  >
                    {a.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm text-muted-foreground leading-relaxed text-pretty ${
                      isLarge ? "line-clamp-3" : "line-clamp-2"
                    }`}
                  >
                    {a.excerpt}
                  </p>
                  <div className="mt-auto pt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <img
                      src={a.author.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{a.author.name}</span>
                    <span>·</span>
                    <span>{a.readMinutes} dk</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Collective;