import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, FlaskConical, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles } from "@/data/mock";

const Research = () => {
  const list = articles.filter((a) => a.kind === "Araştırma");

  return (
    <SiteLayout>
      {/* Hero — energetic */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-accent-glow/10 blur-3xl" />

        <div className="wide-column relative px-6 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 backdrop-blur text-xs font-medium text-foreground/80">
              <FlaskConical className="h-3 w-3 text-accent" strokeWidth={2.5} />
              Kanıta dayalı içerik
            </span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] text-balance">
              Araştır. Anla. <span className="text-accent">Uygula.</span>
            </h1>
            <p className="mt-5 md:mt-7 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-snug">
              Kaynaklara dayalı, derinlemesine incelemeler. Her metin bir
              metodoloji notu ve kaynakça ile birlikte gelir.
            </p>
            <div className="mt-7 flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-accent" strokeWidth={2.5} /> {list.length} makale</span>
              <span>·</span>
              <span>Hakemli süreç</span>
              <span>·</span>
              <span>Kaynakça zorunlu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Liste — modern kartlar */}
      <section className="wide-column px-6 pb-20 md:pb-28">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="eyebrow">Tüm Araştırmalar</span>
            <h2 className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight">Son yayımlananlar</h2>
          </div>
        </div>

        <ol className="grid gap-5 md:gap-6">
          {list.map((a, i) => (
            <li key={a.slug}>
              <Link
                to={`/yazi/${a.slug}`}
                className="group surface-card grid md:grid-cols-12 gap-5 md:gap-8 p-5 md:p-7 hover:-translate-y-0.5 transition-transform"
              >
                <div className="md:col-span-1 flex md:block items-center gap-3">
                  <span className="font-display text-3xl md:text-4xl font-extrabold text-accent leading-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:col-span-8 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="tag">{a.category}</span>
                    {a.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-muted-foreground">#{t}</span>
                    ))}
                  </div>
                  <h3 className="mt-3 card-title font-display font-bold text-xl md:text-2xl leading-snug text-balance">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed line-clamp-2">
                    {a.subtitle}
                  </p>
                  <div className="mt-4 flex items-center gap-2.5 text-xs text-muted-foreground">
                    <img src={a.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-semibold text-foreground">{a.author.name}</span>
                    <span>·</span>
                    <span>{a.publishedAt}</span>
                    <span>·</span>
                    <span>{a.readMinutes} dk</span>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-3 items-end justify-end">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                    Oku <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-14 surface-card p-6 md:p-8 bg-gradient-to-br from-accent-soft/40 to-secondary/40">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-sm md:text-[0.95rem] leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">Metodoloji —</span> Bu
              bölümde yayımlanan her makale en az iki bağımsız kaynak referansı
              içerir ve editör değerlendirmesinden geçer.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Research;