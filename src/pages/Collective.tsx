import { Link } from "react-router-dom";
import { Users, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles } from "@/data/mock";

const tileShapes = [
  "md:col-span-6 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-5 md:row-span-2",
  "md:col-span-4",
] as const;

const Collective = () => {
  const list = articles.filter((a) => a.kind === "Kolektif");
  const tiles = list.length >= 6 ? list : [...list, ...list, ...list].slice(0, 9);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-accent-glow/10 blur-3xl" />

        <div className="wide-column relative px-6 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 backdrop-blur text-xs font-medium text-foreground/80">
              <Users className="h-3 w-3 text-accent" strokeWidth={2.5} />
              Topluluk sesleri
            </span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] text-balance">
              Farklı sesler. <span className="text-accent">Tek mozaik.</span>
            </h1>
            <p className="mt-5 md:mt-7 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-snug">
              Kişisel deneyim, gözlem ve denemeler. Pratiğin içinden gelen
              gerçek hikayeler.
            </p>
            <div className="mt-7 text-sm text-muted-foreground">
              {tiles.length} hikaye · {list.length} yazar
            </div>
          </div>
        </div>
      </section>

      {/* Mozaik */}
      <section className="wide-column px-6 pb-20 md:pb-28">
        <div className="grid md:grid-cols-12 md:auto-rows-[17rem] gap-4 md:gap-5">
          {tiles.map((a, i) => {
            const shape = tileShapes[i % tileShapes.length];
            const isLarge = shape.includes("row-span-2");
            return (
              <Link
                key={`${a.slug}-${i}`}
                to={`/yazi/${a.slug}`}
                className={`group relative overflow-hidden surface-card flex flex-col ${shape}`}
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
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="tag">Kolektif</span>
                    <span className="text-[0.65rem] text-muted-foreground">{a.publishedAt}</span>
                  </div>
                  <h3
                    className={`mt-3 card-title font-display font-bold leading-snug text-balance ${
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
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={a.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="truncate font-medium text-foreground">{a.author.name}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all shrink-0" strokeWidth={2.5} />
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